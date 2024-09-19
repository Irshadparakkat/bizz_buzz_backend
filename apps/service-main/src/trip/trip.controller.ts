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
import { TripService } from './trip.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { ITrip } from 'core/entities/trip/trip.interface';
import { Response } from 'express';
import { CreateTripDto } from './dto/create.trip.dto';
import { UpdateTripDto } from './dto/update.trip.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseTrip } from './dto/response.trip.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { GetParamTripDto, GetQueryTripDto } from './dto/get.trip.dto';
import { BusService } from '../bus/bus.service';
import { RouteService } from '../route/route.service';
import * as async from 'async';
import { IStopTime } from 'core/entities/stop/stop.interface';
import { StopService } from '../stop/stop.service';
import { StopTimeDto } from './dto/stop.time.dto';
import { RandomStringGenerator } from 'shared/service/random.string.genrator.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Trip')
@Controller('trip')
export class TripController {
  constructor(
    private service: TripService,
    private busService: BusService,
    private routeService: RouteService,
    private stopService: StopService,
  ) {}
  singleOutput: SingleOutput<ITrip> = new SingleOutput<ITrip>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<ITrip> = new ListOutput();
  randomStringGenartor: RandomStringGenerator = new RandomStringGenerator();

  @ApiResponse({
    status: 201,
    type: ResponseTrip,
    description: 'Create new Trip',
  })
  @SetPermission(Permission.CreateTrip)
  @Post()
  async create(@Body() body: CreateTripDto, @Res() res: Response) {
    const bus = body.busId ? await this.busService.showBus(body.busId) : null;
    if (bus === undefined) {
      throw this.errorOutput.notFound(res, 'bus');
    }

    const route = await this.routeService.showRoute(body.routeId);
    if (!route) {
      throw this.errorOutput.notFound(res, 'route');
    }

    const stopTime = await async.mapLimit(
      body.stopTime,
      10,
      async (stop: StopTimeDto): Promise<IStopTime> => {
        const busStop = await this.stopService.showStop(stop.stopId);
        if (!busStop) {
          throw this.errorOutput.notFound(res, 'stop');
        }
        return {
          hour: stop.hour,
          min: stop.min,
          stop: busStop,
        };
      },
    );
    const trip = await this.service.createTrip({
      tripName: body.tripName,
      status: body.status,
      bus: body.busId ? bus : null,
      route,
      stopTime,
    });
    return this.singleOutput.single(res, trip, 'trip', true);
  }

  @ApiResponse({
    status: 201,
    type: ResponseTrip,
    description: 'Create multiple Trips',
  })
  @SetPermission(Permission.BulkUploadTrip)
  @Post('bulk')
  async createTrips(
    @Body() body: { trips: CreateTripDto[] },
    @Res() res: Response,
  ) {
    if (!body.trips || !Array.isArray(body.trips)) {
      return this.errorOutput.customError(
        res,
        'Request body must contain an array of trips',
      );
    }
    const createdTrips = [];
    const errors = [];

    await async.mapLimit(body.trips, 5, async (tripDto) => {
      try {
        const route = await this.routeService.listRoute({
          name: tripDto.routeName,
          via: tripDto.via,
        });
        if (!route || route.length === 0) {
          throw this.errorOutput.notFound(res, 'route');
        }

        const busTrips = await Promise.all(
          tripDto.bus.map(async (busInfo) => {
            const bus = await this.busService.listBus({
              vehicleNumber: busInfo.busNumber.split('_')[0],
            });
            if (!bus || bus.length === 0) {
              throw this.errorOutput.notFound(res, 'bus');
            }

            const stopTimes = await Promise.all(
              busInfo.timing.map(async (timing) => {
                const stop = await this.stopService.listStop({
                  name: timing.stopName,
                });
                if (!stop || stop.length === 0) {
                  throw new Error(
                    `Stop with name ${timing.stopName} not found`,
                  );
                }
                const [hour, min] = timing.time.split(':').map(Number);
                return {
                  hour,
                  min,
                  stop: stop[0],
                };
              }),
            );

            return {
              bus: bus[0],
              stopTimes,
            };
          }),
        );

        for (const busTrip of busTrips) {
          const trip = await this.service.createTrip({
            tripName: `${tripDto?.routeName?.split(' ')[0]?.slice(0, 3) + '-' + tripDto?.routeName?.split(' ')[2]?.slice(0, 3)}-${this.generateRandomStr()}`,
            status: tripDto.status,
            route: route[0],
            bus: busTrip.bus,
            stopTime: busTrip.stopTimes,
          });
          createdTrips.push(trip);
        }
      } catch (error) {
        errors.push(
          `Failed to create trip for route '${tripDto.routeName}': ${error.message}`,
        );
      }
    });

    if (errors.length > 0) {
      return this.tripError(res, errors);
    }

    const message = `Created ${createdTrips.length} trips successfully`;
    return this.listOutput.customList(
      res,
      createdTrips,
      'trips',
      'message',
      message,
    );
  }

  private generateRandomStr(): string {
    const randomNumber = Math.floor(Math.random() * 90) + 10;
    const randomString = this.randomStringGenartor.generateRandomString(3);
    return randomNumber + randomString;
  }

  private tripError = (res: Response, errors: string[]) => {
    return res.status(400).json({
      status: false,
      message: errors,
    });
  };

  @ApiResponse({
    status: 200,
    type: ResponseTrip,
    description: 'Get one trip by Id',
  })
  @SetPermission(Permission.GetTrip)
  @Get(':tripId')
  async show(@Param() param: GetParamTripDto, @Res() res: Response) {
    const trip = await this.service.showTrip(param.tripId);
    if (!trip) {
      return this.errorOutput.notFound(res, 'trip');
    }
    return this.singleOutput.single(res, trip, 'trip');
  }

  @ApiResponse({
    status: 200,
    type: ResponseTrip,
    description: 'List all trip',
  })
  @SetPermission(Permission.ListTrip)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryTripDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const where = {
      tripName: query.name,
      commenName: query.commenName,
      bus: { busId: query.busId, name: query.busName },
      route: { routeId: query.routeId, name: query.routeName },
      from: query.from,
      to: query.to,
    };
    const trip = await this.service.listTrip(where, limit, offset);
    return this.listOutput.list(
      res,
      trip,
      'trip',
      offset,
      limit,
      await this.service.count(where),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseTrip,
    description: 'Update one Trip by Id',
  })
  @SetPermission(Permission.UpdateTrip)
  @Put(':tripId')
  async update(
    @Param() param: GetParamTripDto,
    @Body() body: UpdateTripDto,
    @Res() res: Response,
  ) {
    const tripInfo: Partial<ITrip> = {};
    const trip = param.tripId
      ? await this.service.showTrip(param.tripId)
      : null;
    if (trip === undefined) {
      throw this.errorOutput.notFound(res, 'trip');
    }

    if (body.busId) {
      const bus = await this.busService.showBus(body.busId);
      if (!bus) {
        throw this.errorOutput.notFound(res, 'bus');
      }
      tripInfo.bus = bus;
    }
    if (body.routeId) {
      const route = await this.routeService.showRoute(body.routeId);
      if (!route) {
        throw this.errorOutput.notFound(res, 'route');
      }
      tripInfo.route = route;
    }
    if (body.status) tripInfo.status = body.status;
    if (body.tripName) tripInfo.tripName = body.tripName;

    if (body.stopTime) {
      const stopTime = await async.mapLimit(
        body.stopTime,
        10,
        async (stop: StopTimeDto): Promise<IStopTime> => {
          const busStop = await this.stopService.showStop(stop.stopId);
          if (!busStop) {
            throw this.errorOutput.notFound(res, 'stop');
          }
          return {
            hour: stop.hour,
            min: stop.min,
            stop: busStop,
          };
        },
      );
      tripInfo.stopTime = stopTime;
    }
    const tripCreated = await this.service.updateTrip(param.tripId, tripInfo);
    return this.singleOutput.single(res, tripCreated, 'trip', true);
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete trip by Id',
  })
  @SetPermission(Permission.DeleteTrip)
  @Delete(':tripId')
  async delete(@Param() param: GetParamTripDto, @Res() res: Response) {
    const trip = await this.service.showTrip(param.tripId);
    if (!trip) {
      return this.errorOutput.notFound(res, 'trip');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteTrip(param.tripId),
    );
  }
}
