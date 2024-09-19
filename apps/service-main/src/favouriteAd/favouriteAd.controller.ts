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
import { FavouriteAdService } from './favouriteAd.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { Response } from 'express';
import {
  CreateFavouriteAdDto,
  CreatefavouriteAdParamDto,
} from './dto/create.favouriteAd.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseFavouriteAd } from './dto/response.favouriteAd.dto';
import { CustomerService } from '../customer/customer.service';
import { IFavouriteAd } from 'core/entities/favouriteAd/favouriteAd.interface';
import {
  GetParamFavouriteAdDto,
  GetQueryFavouriteAdDto,
} from './dto/get.favouriteAd.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { AdService } from '../ad/ad.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('FavouriteAd')
@Controller('favourite-ad')
export class FavouriteAdController {
  constructor(
    private service: FavouriteAdService,
    private customerService: CustomerService,
    private adService: AdService,
  ) {}
  singleOutput: SingleOutput<IFavouriteAd> = new SingleOutput<IFavouriteAd>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IFavouriteAd> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseFavouriteAd,
    description: 'add FavouriteAd',
  })
  @SetPermission(Permission.CreateFavAd)
  @Post(':customerId')
  async create(
    @Param() param: CreatefavouriteAdParamDto,
    @Body() body: CreateFavouriteAdDto,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }
    const ad = await this.adService.showAd(body.adId);
    if (!ad) {
      return this.errorOutput.notFound(res, 'ad');
    }

    const favouriteAds = await this.service.listFavouriteAd(
      { customer, ad },
      1,
      0,
    );

    if (favouriteAds.length > 0) {
      return this.singleOutput.single(
        res,
        favouriteAds[0],
        'favouriteAd',
        true,
      );
    }
    const favouriteAd = await this.service.createFavouriteAd({
      customer,
      ad,
    });
    return this.singleOutput.single(res, favouriteAd, 'favouriteAd', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseFavouriteAd,
    description: 'List FavouriteAd by Id',
  })
  @SetPermission(Permission.ListFavAd)
  @Get(':customerId')
  async list(
    @Param() param: GetParamFavouriteAdDto,
    @Res() res: Response,
    @Query() query: GetQueryFavouriteAdDto,
  ) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }

    const favouriteAd = await this.service.listFavouriteAd(
      { customer },
      limit,
      offset,
    );

    return this.listOutput.list(
      res,
      favouriteAd,
      'favouriteAd',
      offset,
      limit,
      await this.service.count({ customer }),
    );
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete FavouriteAd by CustomerId and AdId',
  })
  @SetPermission(Permission.DeleteFavAd)
  @Delete(':customerId/:adId')
  async delete(@Param() param: GetParamFavouriteAdDto, @Res() res: Response) {
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }

    const ad = await this.adService.showAd(param.adId);
    if (!ad) {
      return this.errorOutput.notFound(res, 'ad');
    }

    const favouriteAd = await this.service.listFavouriteAd({
      customer,
      ad,
    });
    if (favouriteAd.length > 0) {
      return this.singleOutput.delete(
        res,
        await this.service.deleteFavouriteAd(favouriteAd[0].favouriteAdId),
      );
    }

    return this.errorOutput.notFound(res, 'favouriteAd');
  }
}
