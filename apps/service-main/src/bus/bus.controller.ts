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
import { BusService } from './bus.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IBus } from 'core/entities/bus/bus.interface';
import { Response } from 'express';
import { CreateBusDto } from './dto/create.bus.dto';
import { UpdateBusDto } from './dto/update.bus.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseBus } from './dto/response.bus.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { GetParamBusDto, GetQueryBusDto } from './dto/get.bus.dto';
import { TripService } from '../trip/trip.service';
import { ITrip } from 'core/entities/trip/trip.interface';
import * as async from 'async';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Bus')
@Controller('bus')
export class BusController {
  constructor(
    private service: BusService,
    private tripService: TripService,
  ) {}
  singleOutput: SingleOutput<IBus> = new SingleOutput<IBus>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IBus> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseBus,
    description: 'Create new Bus',
  })
  @SetPermission(Permission.CreateBus)
  @Post()
  async create(@Body() body: CreateBusDto, @Res() res: Response) {
    const busExist = await this.service.listBus({
      vehicleNumber: body.vehicleNumber,
    });
    if (busExist.length > 0) {
      return this.errorOutput.customError(res, 'Bus already exist.');
    }
    const bus = await this.service.createBus({
      ...body,
      driver: [],
    });
    return this.singleOutput.single(res, bus, 'bus', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseBus,
    description: 'Get one Bus by Id',
  })
  @SetPermission(Permission.GetBus)
  @Get(':busId')
  async show(@Param() param: GetParamBusDto, @Res() res: Response) {
    const bus = await this.service.showBus(param.busId);
    if (!bus) {
      return this.errorOutput.notFound(res, 'bus');
    }
    return this.singleOutput.single(res, bus, 'bus');
  }

  @ApiResponse({
    status: 200,
    type: ResponseBus,
    description: 'List all bus',
  })
  @SetPermission(Permission.ListBus)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryBusDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const where = {
      driver: { driverId: query.driverId },
      name: query.name,
    };
    const bus = await this.service.listBus(where, limit, offset);
    return this.listOutput.list(
      res,
      bus,
      'bus',
      offset,
      limit,
      await this.service.count(where),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseBus,
    description: 'Update one Bus by Id',
  })
  @SetPermission(Permission.UpdateBus)
  @Put(':busId')
  async update(
    @Param() param: GetParamBusDto,
    @Body() body: UpdateBusDto,
    @Res() res: Response,
  ) {
    const data = await this.service.showBus(param.busId);
    if (!data) {
      return this.errorOutput.notFound(res, 'bus');
    }
    const bus = await this.service.updateBus(param.busId, {
      ...body,
      busId: param.busId,
    });
    return this.singleOutput.single(res, bus, 'bus');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete Bus by Id',
  })
  @SetPermission(Permission.DeleteBus)
  @Delete(':busId')
  async delete(@Param() param: GetParamBusDto, @Res() res: Response) {
    const bus = await this.service.showBus(param.busId);
    if (!bus) {
      return this.errorOutput.notFound(res, 'bus');
    }
    const trips = await this.tripService.listTrip({
      bus: { busId: param.busId },
    });

    if (trips && trips.length > 0) {
      await async.mapLimit(trips, 5, async (trip: ITrip) => {
        await this.tripService.deleteTrip(trip.tripId);
      });
    }

    return this.singleOutput.delete(
      res,
      await this.service.deleteBus(param.busId),
    );
  }
}
