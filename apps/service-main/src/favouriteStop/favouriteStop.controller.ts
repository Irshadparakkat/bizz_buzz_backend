import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FavouriteStopService } from './favouriteStop.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { Response } from 'express';
import {
  CreateFavouriteStopDto,
  CreatefavouriteStopParamDto,
} from './dto/create.favouriteStop.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseFavouriteStop } from './dto/response.favouriteStop.dto';
import { CustomerService } from '../customer/customer.service';
import { IFavouriteStop } from 'core/entities/favouriteStop/favouriteStop.interface';
import {
  GetParamFavouriteStopDto,
  GetQueryFavouriteStopDto,
} from './dto/get.favouriteStop.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { StopService } from '../stop/stop.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('FavouriteStop')
@Controller('favourite-stop')
export class FavouriteStopController {
  constructor(
    private service: FavouriteStopService,
    private customerService: CustomerService,
    private stopService: StopService,
  ) {}
  singleOutput: SingleOutput<IFavouriteStop> =
    new SingleOutput<IFavouriteStop>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IFavouriteStop> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseFavouriteStop,
    description: 'add FavouriteStop',
  })
  @SetPermission(Permission.CreateFavStop)
  @Post(':customerId')
  async create(
    @Param() param: CreatefavouriteStopParamDto,
    @Body() body: CreateFavouriteStopDto,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }
    const stop = await this.stopService.showStop(body.stopId);
    if (!stop) {
      return this.errorOutput.notFound(res, 'stop');
    }
    const favouriteStops = await this.service.listFavouriteStop(
      { customer, stop },
      1,
      0,
    );
    if (favouriteStops.length > 0) {
      return this.singleOutput.single(
        res,
        favouriteStops[0],
        'favouriteStop',
        true,
      );
    }
    const favouriteStop = await this.service.createFavouriteStop({
      customer,
      stop,
    });
    return this.singleOutput.single(res, favouriteStop, 'favouriteStop', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseFavouriteStop,
    description: 'List FavouriteStop by Id',
  })
  @SetPermission(Permission.ListFavStop)
  @Get(':customerId')
  async list(
    @Param() param: GetParamFavouriteStopDto,
    @Res() res: Response,
    @Query() query: GetQueryFavouriteStopDto,
  ) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }

    const favouriteStop = await this.service.listFavouriteStop(
      { customer },
      limit,
      offset,
    );

    return this.listOutput.list(
      res,
      favouriteStop,
      'favouriteStop',
      offset,
      limit,
      await this.service.count({ customer }),
    );
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete FavouriteStop by CustomerId and StopId',
  })
  @SetPermission(Permission.DeleteFavStop)
  @Delete(':customerId/:stopId')
  async delete(@Param() param: GetParamFavouriteStopDto, @Res() res: Response) {
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }

    const stop = await this.stopService.showStop(param.stopId);
    if (!stop) {
      return this.errorOutput.notFound(res, 'stop');
    }

    const favouriteStop = await this.service.listFavouriteStop({
      customer,
      stop,
    });
    if (favouriteStop.length > 0) {
      return this.singleOutput.delete(
        res,
        await this.service.deleteFavouriteStop(
          favouriteStop[0].favouriteStopId,
        ),
      );
    }

    return this.errorOutput.notFound(res, 'favouriteStop');
  }
}
