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
import { DriverService } from './driver.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import {
  IDriver,
  IDriverTripTiming,
} from 'core/entities/driver/driver.interface';
import { Response } from 'express';
import { AssignBusDto, CreateDriverDto } from './dto/create.driver.dto';
import { UpdateDriverDto } from './dto/update.driver.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDriver } from './dto/response.driver.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { GetParamDriverDto, GetQueryDriverDto } from './dto/get.driver.dto';
import { BusService } from '../bus/bus.service';
import { IBus } from 'core/entities/bus/bus.interface';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(
    private service: DriverService,
    private busService: BusService,
  ) {}
  singleOutput: SingleOutput<IDriver> = new SingleOutput<IDriver>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IDriver | IDriverTripTiming> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseDriver,
    description: 'Create new Driver',
  })
  @SetPermission(Permission.CreateDriver)
  @Post()
  async create(@Body() body: CreateDriverDto, @Res() res: Response) {
    const existingDriver = await this.service.listDriver([
      { email: body.email },
      { phoneNumber: body.phoneNumber },
    ]);

    if (existingDriver.length > 0) {
      const badReq = [];
      existingDriver[0].email == body.email &&
        badReq.push('email already exist');
      existingDriver[0].phoneNumber == body.phoneNumber &&
        badReq.push('phoneNumber already exist');
      throw this.errorOutput.badRequestError(res, badReq);
    }

    const driver = await this.service.createDriver({
      ...body,
      bus: [],
    });
    return this.singleOutput.single(res, driver, 'driver', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseDriver,
    description: 'Get one Driver by Id',
  })
  @SetPermission(Permission.GetDriver)
  @Get(':driverId')
  async show(@Param() param: GetParamDriverDto, @Res() res: Response) {
    const driver = await this.service.showDriver(param.driverId);
    if (!driver) {
      return this.errorOutput.notFound(res, 'driver');
    }
    return this.singleOutput.single(res, driver, 'driver');
  }

  @ApiResponse({
    status: 200,
    type: ResponseDriver,
    description: 'list trip times of a driver',
  })
  @SetPermission(Permission.GetTripTiming)
  @Get(':driverId/trips/timing')
  async tripTiming(@Param() param: GetParamDriverDto, @Res() res: Response) {
    const driver = await this.service.tripTiming(param.driverId);
    if (!driver) {
      return this.errorOutput.notFound(res, 'driver');
    }
    return this.listOutput.list(res, driver, 'driver', 0, 0, 0);
  }

  @ApiResponse({
    status: 200,
    type: ResponseDriver,
    description: 'List all driver',
  })
  @SetPermission(Permission.ListDriver)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryDriverDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const driver = await this.service.listDriver(query, limit, offset);
    return this.listOutput.list(
      res,
      driver,
      'driver',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseDriver,
    description: 'Update one Driver by Id',
  })
  @SetPermission(Permission.UpdateDriver)
  @Put(':driverId')
  async update(
    @Param() param: GetParamDriverDto,
    @Body() body: UpdateDriverDto,
    @Res() res: Response,
  ) {
    if (body.email || body.phoneNumber) {
      const existingDriver = (
        await this.service.listDriver([
          { email: body.email },
          { phoneNumber: body.phoneNumber },
        ])
      ).filter((driver) => driver.driverId != param.driverId);

      if (existingDriver.length > 0 && existingDriver[0]) {
        const badReq = [];
        existingDriver[0].email == body.email &&
          badReq.push('email already exist');
        existingDriver[0].phoneNumber == body.phoneNumber &&
          badReq.push('phoneNumber already exist');
        throw this.errorOutput.badRequestError(res, badReq);
      }
    }

    const data = await this.service.showDriver(param.driverId);
    if (!data) {
      return this.errorOutput.notFound(res, 'driver');
    }
    const driver = await this.service.updateDriver(param.driverId, {
      ...body,
      driverId: param.driverId,
    });
    return this.singleOutput.single(res, driver, 'driver');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete Driver by Id',
  })
  @SetPermission(Permission.DeleteDriver)
  @Delete(':driverId')
  async delete(@Param() param: GetParamDriverDto, @Res() res: Response) {
    const driver = await this.service.showDriver(param.driverId);
    if (!driver) {
      return this.errorOutput.notFound(res, 'driver');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteDriver(param.driverId),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseDriver,
    description: 'Assign bus',
  })
  @SetPermission(Permission.AssignBus)
  @Post(':driverId/bus/:busId')
  async assignBus(@Param() body: AssignBusDto, @Res() res: Response) {
    const driver = await this.service.showDriver(body.driverId);
    if (!driver) {
      return this.errorOutput.notFound(res, 'driver');
    }

    if (driver.bus.some((selectedBus) => selectedBus.busId === body.busId)) {
      return this.errorOutput.badRequestError(res, [
        'bus already assigned to this driver',
      ]);
    }

    const bus = await this.busService.showBus(body.busId);
    if (!bus) {
      return this.errorOutput.notFound(res, 'bus');
    }

    const updatedDriver = await this.service.updateDriver(driver.driverId, {
      driverId: driver.driverId,
      bus: [...driver.bus, bus],
    });

    return this.singleOutput.single(res, updatedDriver, 'driver', true);
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Unassign bus',
  })
  @SetPermission(Permission.UnassignBus)
  @Delete(':driverId/bus/:busId')
  async unAssignBus(@Param() body: AssignBusDto, @Res() res: Response) {
    const driver = await this.service.showDriver(body.driverId);
    if (!driver) {
      return this.errorOutput.notFound(res, 'driver');
    }

    let bus: IBus[] = [];
    if (driver.bus.some((selectedBus) => selectedBus.busId === body.busId)) {
      bus = driver.bus.filter(
        (selectedBus) => selectedBus.busId !== body.busId,
      );
    } else {
      return this.errorOutput.badRequestError(res, [
        'bus not not found for selected bus',
      ]);
    }

    const updatedDriver = await this.service.updateDriver(driver.driverId, {
      driverId: driver.driverId,
      bus,
    });

    return this.singleOutput.single(res, updatedDriver, 'driver', true);
  }
}
