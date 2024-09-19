import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StopService } from './stop.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IStop } from 'core/entities/stop/stop.interface';
import { Response } from 'express';
import { CreateStopDto } from './dto/create.stop.dto';
import { UpdateStopDto } from './dto/update.stop.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseStop } from './dto/response.stop.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { GetParamStopDto, GetQueryStopDto } from './dto/get.stop.dto';
import * as async from 'async';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Stop')
@Controller('stop')
export class StopController {
  constructor(private service: StopService) {}
  singleOutput: SingleOutput<IStop> = new SingleOutput<IStop>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IStop> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseStop,
    description: 'Create new Stop',
  })
  @SetPermission(Permission.CreateStop)
  @Post()
  async create(@Body() body: CreateStopDto, @Res() res: Response) {
    const excistingStop = await this.service.listStop([
      { name: body.name },
      { latitude: body.latitude, longitude: body.longitude },
    ]);
    if (excistingStop.filter((item) => item.name == body.name).length > 0)
      throw this.errorOutput.customError(res, 'Stop name already Exist');
    const sameLocation = excistingStop.filter(
      (item) =>
        item.latitude == body.latitude && item.longitude == body.longitude,
    );
    if (sameLocation.length > 0)
      throw this.errorOutput.customError(
        res,
        `Location already Exist with name ${sameLocation[0].name}`,
      );
    const stop = await this.service.createStop({
      ...body,
      route: [],
    });
    return this.singleOutput.single(res, stop, 'stop', true);
  }

  @ApiResponse({
    status: 201,
    type: ResponseStop,
    description: 'Create multiple Stops',
  })
  @SetPermission(Permission.BulkUploadStop)
  @Post('bulk')
  async createStops(
    @Body() body: { stops: CreateStopDto[] },
    @Res() res: Response,
  ) {
    if (!body.stops || !Array.isArray(body.stops)) {
      return this.errorOutput.customError(
        res,
        'Request body must contain an array of stops',
      );
    }

    const createdStops = [];
    const errors = [];

    await async.mapLimit(body.stops, 20, async (stop) => {
      try {
        const existingStop = await this.service.listStop([
          { name: stop.name },
          { latitude: stop.latitude, longitude: stop.longitude },
        ]);

        const stopWithName = existingStop.find(
          (item) => item.name === stop.name,
        );
        if (stopWithName) {
          errors.push(`Stop name '${stop.name}' already exists`);
          return;
        }

        const stopWithLocation = existingStop.find(
          (item) =>
            item.latitude === stop.latitude &&
            item.longitude === stop.longitude,
        );
        if (stopWithLocation) {
          errors.push(
            `Location for '${stop.name}' already exists with name ${stopWithLocation.name}`,
          );
          return;
        }

        const createdStop = await this.service.createStop({
          ...stop,
          route: [],
        });
        createdStops.push(createdStop);
      } catch (error) {
        errors.push(`Failed to create stop '${stop.name}': ${error.message}`);
      }
    });

    if (errors.length > 0) {
      return this.stopError(res, errors);
    }

    const message = `Created ${createdStops.length} stops successfully`;

    return this.listOutput.customList(
      res,
      createdStops,
      'stops',
      'message',
      message,
    );
  }

  private stopError = (res: Response, errors: string[]) => {
    return res.status(400).json({
      status: false,
      message: errors,
    });
  };

  @ApiResponse({
    status: 200,
    type: ResponseStop,
    description: 'Get one Stop by Id',
  })
  @SetPermission(Permission.GetStop)
  @Get(':stopId')
  async show(@Param() param: GetParamStopDto, @Res() res: Response) {
    const stop = await this.service.showStop(param.stopId);
    if (!stop) {
      return this.errorOutput.notFound(res, 'stop');
    }
    return this.singleOutput.single(res, stop, 'stop');
  }

  @ApiResponse({
    status: 200,
    type: ResponseStop,
    description: 'List all stop',
  })
  @SetPermission(Permission.ListStop)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryStopDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    let currentLocation: { latitude: number; longitude: number } | undefined;
    if (query.myLatitude && query.myLongitude) {
      currentLocation = {
        latitude: query.myLatitude,
        longitude: query.myLongitude,
      };
    }
    delete query.limit;
    delete query.offset;
    delete query.myLatitude;
    delete query.myLongitude;
    const stop = await this.service.listStop(
      query,
      limit,
      offset,
      currentLocation,
    );
    return this.listOutput.list(
      res,
      stop,
      'stop',
      offset,
      limit,
      await this.service.count(query, currentLocation),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseStop,
    description: 'Update one Stop by Id',
  })
  @SetPermission(Permission.UpdateStop)
  @Put(':stopId')
  async update(
    @Param() param: GetParamStopDto,
    @Body() body: UpdateStopDto,
    @Res() res: Response,
  ) {
    const data = await this.service.showStop(param.stopId);
    if (!data) {
      return this.errorOutput.notFound(res, 'stop');
    }
    const stop = await this.service.updateStop(param.stopId, {
      ...body,
      stopId: param.stopId,
    });
    return this.singleOutput.single(res, stop, 'stop');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete Stop by Id',
  })
  @SetPermission(Permission.DeleteStop)
  @Delete(':stopId')
  async delete(@Param() param: GetParamStopDto, @Res() res: Response) {
    const stop = await this.service.showStop(param.stopId);
    if (!stop) {
      return this.errorOutput.notFound(res, 'stop');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteStop(param.stopId),
    );
  }
}
