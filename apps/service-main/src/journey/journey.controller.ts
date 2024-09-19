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
import { JourneyService } from './journey.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IJourney } from 'core/entities/journey/journey.interface';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { CreateJourneyDto, JourneyStatusEnum } from './dto/create.journey.dto';
import { UpdateJourneyDto } from './dto/update.journey.dto';
import { ResponseJourney } from './dto/response.journey.dto';
import { GetParamJourneyDto, GetQueryJourneyDto } from './dto/get.journey.dto';
import { DriverService } from '../driver/driver.service';
import { TripService } from '../trip/trip.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Journey')
@Controller('journey')
export class JourneyController {
  constructor(
    private service: JourneyService,
    private driverService: DriverService,
    private tripService: TripService,
  ) {}
  singleOutput: SingleOutput<IJourney> = new SingleOutput<IJourney>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IJourney> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseJourney,
    description: 'Create new Journey',
  })
  @SetPermission(Permission.CreateJourney)
  @Post()
  async create(@Body() body: CreateJourneyDto, @Res() res: Response) {
    const driver = await this.driverService.showDriver(body.driverId);
    if (!driver) {
      return this.errorOutput.notFound(res, 'driver');
    }

    const trip = await this.tripService.showTrip(body.tripId);
    if (!trip) {
      return this.errorOutput.notFound(res, 'trip');
    }

    if (Array.isArray(trip.journey) && trip.journey.length > 0) {
      return this.errorOutput.customError(res, 'trip already started');
    }

    const journey = await this.service.createJourney({
      driver,
      trip,
      status: body.status,
    });
    return this.singleOutput.single(res, journey, 'journey', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseJourney,
    description: 'Get one Journey by Id',
  })
  @SetPermission(Permission.GetJourney)
  @Get(':journeyId')
  async show(@Param() param: GetParamJourneyDto, @Res() res: Response) {
    const journey = await this.service.showJourney(param.journeyId);
    if (!journey) {
      return this.errorOutput.notFound(res, 'journey');
    }
    return this.singleOutput.single(res, journey, 'journey');
  }

  @ApiResponse({
    status: 200,
    type: ResponseJourney,
    description: 'List all journey',
  })
  @SetPermission(Permission.ListJourney)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryJourneyDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;

    const where = {
      journeyId: query.journeyId,
      status: query.status,
      trip: { tripId: query.tripId },
    };
    const journey = await this.service.listJourney(where, limit, offset);
    return this.listOutput.list(
      res,
      journey,
      'journey',
      offset,
      limit,
      await this.service.count(where),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseJourney,
    description: 'Update one Journey by Id',
  })
  @SetPermission(Permission.UpdateJourney)
  @Put(':journeyId')
  async update(
    @Param() param: GetParamJourneyDto,
    @Body() body: UpdateJourneyDto,
    @Res() res: Response,
  ) {
    const data = await this.service.showJourney(param.journeyId);
    if (!data) {
      return this.errorOutput.notFound(res, 'journey');
    }
    const journey = await this.service.updateJourney(param.journeyId, body);
    return this.singleOutput.single(res, journey, 'journey');
  }

  @SetPermission(Permission.DeleteJourney)
  @Delete(':journeyId')
  async delete(@Param() param: GetParamJourneyDto, @Res() res: Response) {
    const journey = await this.service.showJourney(param.journeyId);
    if (!journey) {
      return this.errorOutput.notFound(res, 'journey');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteJourney(param.journeyId),
    );
  }
}
