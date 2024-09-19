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

import * as async from 'async';

import { RouteService } from './route.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IRoute } from 'core/entities/route/route.interface';
import { Response } from 'express';
import { CreateRouteDto } from './dto/create.route.dto';
import { UpdateRouteDto } from './dto/update.route.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseRoute } from './dto/response.route.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import {
  GetParamRouteDto,
  GetParamRouteStopDto,
  GetQueryRouteDto,
} from './dto/get.route.dto';
import { AddStopDto, AddStopOrder, addStopsDto } from './dto/add.stops.dto';
import { StopService } from '../stop/stop.service';
import { CreateStopDto } from '../stop/dto/create.stop.dto';
import { ResponseStop } from '../stop/dto/response.stop.dto';
import { TripService } from '../trip/trip.service';
import { ITrip } from 'core/entities/trip/trip.interface';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(
    private service: RouteService,
    private stopService: StopService,
    private tripService: TripService,
  ) {}
  singleOutput: SingleOutput<IRoute> = new SingleOutput<IRoute>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IRoute> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseRoute,
    description: 'Create new Route',
  })
  @SetPermission(Permission.CreateRoute)
  @Post()
  async create(@Body() body: CreateRouteDto, @Res() res: Response) {
    const route = await this.service.createRoute({
      ...body,
      stop: [],
    });
    return this.singleOutput.single(res, route, 'route', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseRoute,
    description: 'Get one Route by Id',
  })
  @SetPermission(Permission.GetRoute)
  @Get(':routeId')
  async show(@Param() param: GetParamRouteDto, @Res() res: Response) {
    const route = await this.service.showRoute(param.routeId);
    if (!route) {
      return this.errorOutput.notFound(res, 'route');
    }
    return this.singleOutput.single(res, route, 'route');
  }

  @ApiResponse({
    status: 200,
    type: ResponseRoute,
    description: 'List all route',
  })
  @SetPermission(Permission.ListRoute)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryRouteDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const route = await this.service.listRoute(query, limit, offset);
    return this.listOutput.list(
      res,
      route,
      'route',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseRoute,
    description: 'Update one Route by Id',
  })
  @SetPermission(Permission.UpdateRoute)
  @Put(':routeId')
  async update(
    @Param() param: GetParamRouteDto,
    @Body() body: UpdateRouteDto,
    @Res() res: Response,
  ) {
    const data = await this.service.showRoute(param.routeId);
    if (!data) {
      return this.errorOutput.notFound(res, 'route');
    }
    const route = await this.service.updateRoute(param.routeId, {
      routeId: param.routeId,
      name: body.name,
      via: body.via,
    });
    return this.singleOutput.single(res, route, 'route');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete Route by Id',
  })
  @SetPermission(Permission.DeleteRoute)
  @Delete(':routeId')
  async delete(@Param() param: GetParamRouteDto, @Res() res: Response) {
    const route = await this.service.showRoute(param.routeId);
    if (!route) {
      return this.errorOutput.notFound(res, 'route');
    }
    const trips = await this.tripService.listTrip({
      route: { routeId: param.routeId },
    });

    if (trips && trips.length > 0) {
      await async.mapLimit(trips, 5, async (trip: ITrip) => {
        await this.tripService.deleteTrip(trip.tripId);
      });
    }

    return this.singleOutput.delete(
      res,
      await this.service.deleteRoute(param.routeId),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseStop,
    description:
      'update new stop list in a route, it will accept new or existing stops',
  })
  @SetPermission(Permission.UpdateStop)
  @Put(':routeId/stops')
  async updateStops(
    @Param() param: GetParamRouteDto,
    @Body() body: addStopsDto,
    @Res() res: Response,
  ) {
    const route = await this.service.showRoute(param.routeId);
    if (!route) {
      throw this.errorOutput.notFound(res, 'route');
    }

    await this.service.clearStops(param.routeId);
    route.stop = [];
    const result = await async.mapLimit(body.stops, 10, async (stop) => {
      // validate if any stop is already there in added stops
      const existingStop = await this.stopService.listStop([
        {
          latitude: stop.latitude,
          longitude: stop.longitude,
        },
        {
          name: stop.name,
        },
      ]);

      if (existingStop?.length > 0) {
        const routeDuplication = route.stop.filter(
          (routeStop) => routeStop.name === existingStop[0].name,
        );
        if (routeDuplication.length > 0) {
          return {
            status: false,
            error: `stop is already exist in this route with name: ${existingStop[0].name}, latitude: ${existingStop[0].latitude}, longitude: ${existingStop[0].longitude}`,
          };
        }
      }

      const order = stop.order;
      delete stop.order;

      const stopAddStatus = await this.service.addStop(
        route,
        existingStop?.length > 0
          ? existingStop[0]
          : await this.stopService.createStop(stop),
        order,
      );
      route.stop.push(existingStop?.length > 0 ? existingStop[0] : stop);

      const isDuplicateStop =
        existingStop.length > 0 &&
        !(
          stop?.name == existingStop[0].name &&
          stop?.latitude == existingStop[0].latitude &&
          stop?.longitude == existingStop[0].longitude
        );
      return {
        status: stopAddStatus,
        error:
          existingStop?.length > 0 && isDuplicateStop
            ? `stop added with name: ${existingStop[0].name}, latitude: ${existingStop[0].latitude}, longitude: ${existingStop[0].longitude}`
            : '',
      };
    });

    return this.singleOutput.singleWithWarning(
      res,
      await this.service.showRoute(param.routeId),
      result,
      'route',
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseStop,
    description: 'Create stop from a route',
  })
  @SetPermission(Permission.CreateStop)
  @Post(':routeId/stop/:stopId')
  async addStop(
    @Body() body: AddStopOrder,
    @Param() param: GetParamRouteStopDto,
    @Res() res: Response,
  ) {
    const route = await this.service.showRoute(param.routeId);
    if (!route) {
      throw this.errorOutput.notFound(res, 'route');
    }

    const duplicate = route.stop.filter((stop) => stop.stopId == param.stopId);

    if (duplicate.length > 0) {
      throw this.errorOutput.badRequestError(res, [
        'stop already added in this route',
      ]);
    }
    const stop = await this.stopService.showStop(param.stopId);
    if (!stop) {
      throw this.errorOutput.notFound(res, 'stop');
    }

    await this.service.addStop(route, stop, body.order);
    return this.singleOutput.single(
      res,
      await this.service.showRoute(param.routeId),
      'route',
    );
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Remove stop from a route',
  })
  @SetPermission(Permission.DeleteStop)
  @Delete(':routeId/stop/:stopId')
  async removeStop(@Param() param: GetParamRouteStopDto, @Res() res: Response) {
    const route = await this.service.listRoute({
      routeId: param.routeId,
      routeStop: { stop: { stopId: param.stopId } },
    });

    if (route.length === 0) {
      throw this.errorOutput.notFound(res, 'stop not found');
    }

    return this.singleOutput.delete(
      res,
      await this.service.removeStop(param.routeId, param.stopId),
    );
  }
}
