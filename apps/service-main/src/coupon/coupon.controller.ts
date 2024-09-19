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
import { CouponService } from './coupon.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCoupon } from './dto/response.coupon.dto';
import { CreateCouponDto } from './dto/create.coupon.dto';
import {
  CreateCouponParamDto,
  GetCouponParamDto,
  GetQueryCouponDto,
} from './dto/get.coupon.dto';
import { CustomerService } from '../customer/customer.service';
import { ICoupon } from 'core/entities/coupon/coupon.interface';
import { SettingService } from '../setting/setting.service';
import { BusinessService } from '../business/business.service';
import { RedemeCouponDto } from './dto/redeme.coupon.dto';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Coupon')
@Controller('')
export class CouponController {
  constructor(
    private service: CouponService,
    private customerService: CustomerService,
    private businessService: BusinessService,
    private settingService: SettingService,
  ) {}
  singleOutput: SingleOutput<ICoupon> = new SingleOutput<ICoupon>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<ICoupon> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseCoupon,
    description: 'Create new Coupon',
  })
  @SetPermission(Permission.CreateCoupon)
  @Post('coupon/:customerId')
  async create(
    @Param() param: CreateCouponParamDto,
    @Body() body: CreateCouponDto,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }

    const settings = await this.settingService.showSetting();

    const minAmountForCoupon =
      settings.minClaimPoints / settings.minConversionPoints;
    if (minAmountForCoupon > body.amount) {
      return this.errorOutput.customError(
        res,
        `Minimum claimable amount is ${minAmountForCoupon}`,
      );
    }

    const maxRedemption = Math.floor(
      customer.milestone / settings.minConversionPoints,
    );
    const pointRequired = body.amount * settings.minConversionPoints;
    if (maxRedemption < body.amount) {
      return this.errorOutput.customError(
        res,
        `Maximum available amount is ${maxRedemption}`,
      );
    }

    const validity = new Date(
      new Date().getTime() + settings.rewardExpiryInDays * 24 * 60 * 60 * 1000,
    );

    this.customerService.updateCustomer(customer.customerId, {
      milestone: customer.milestone - pointRequired,
    });

    const coupon = await this.service.addCoupon({
      customer,
      amount: body.amount,
      validity,
      point: pointRequired,
    });
    return this.singleOutput.single(res, coupon, 'coupon', true);
  }

  @ApiResponse({
    status: 201,
    type: ResponseCoupon,
    description: 'Get coupons',
  })
  @SetPermission(Permission.ListCoupon)
  @Get('coupon')
  async get(@Query() query: GetQueryCouponDto, @Res() res: Response) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    const where: Partial<ICoupon> = {};
    if (query.customerId) {
      const customer = await this.customerService.showCustomer(
        query.customerId,
      );
      if (!customer) {
        return this.errorOutput.notFound(res, 'customer');
      }
      where.customer = customer;
    }

    if (query.coupon) where.coupon = query.coupon;

    if (query.businessId) {
      const business = await this.businessService.showBusiness(
        query.businessId,
      );
      if (!business) {
        return this.errorOutput.notFound(res, 'business');
      }
      where.business = business;
    }

    if (query.status !== undefined) {
      if (query.status == 'Redeemed') {
        where.redemedStatus = true;
      }
      if (query.status == 'Active') {
        where.redemedStatus = false;
        where.expired = false;
      }
      if (query.status == 'Expired') {
        where.redemedStatus = false;
        where.expired = true;
      }
    }

    const coupon = await this.service.listcoupon(where, limit, offset);
    return this.listOutput.list(
      res,
      coupon,
      'coupon',
      limit,
      offset,
      await this.service.count(where),
    );
  }

  @ApiResponse({
    status: 201,
    type: ResponseCoupon,
    description: 'get one coupon',
  })
  @SetPermission(Permission.GetCoupon)
  @Get('coupon/:couponId')
  async show(@Param() param: GetCouponParamDto, @Res() res: Response) {
    const coupon = await this.service.showCoupon(param.couponId);
    if (!coupon) {
      return this.errorOutput.notFound(res, 'coupon');
    }
    return this.singleOutput.single(res, coupon, 'coupon');
  }

  @ApiResponse({
    status: 201,
    type: ResponseCoupon,
    description: 'Redeem a Coupon',
  })
  @SetPermission(Permission.RedeemCoupon)
  @Post('redeem')
  async redeme(@Body() body: RedemeCouponDto, @Res() res: Response) {
    const business = await this.businessService.showBusiness(body.businessId);

    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }

    const coupons = await this.service.listcoupon({
      coupon: body.coupon,
    });

    if (coupons.length > 0) {
      if (coupons[0].redemedStatus) {
        return this.errorOutput.customError(
          res,
          'This coupon is already availed',
        );
      }
      if (coupons[0].validity.getTime() < new Date().getTime()) {
        return this.errorOutput.customError(res, 'This coupon is expired');
      }

      const coupon = await this.service.addCoupon({
        ...coupons[0],
        redemedStatus: true,
        redemedTime: new Date(),
        business,
      });
      return this.singleOutput.single(res, coupon, 'coupon');
    }
    return this.errorOutput.notFound(res, 'coupon');
  }
}
