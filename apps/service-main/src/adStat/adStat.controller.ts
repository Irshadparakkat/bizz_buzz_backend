import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdStatService } from './adStat.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { Response } from 'express';
import { CreateAdStatDto, CreateParamDto } from './dto/create.adStat.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAdStat, ResponseStats } from './dto/response.adStat.dto';
import { CustomerService } from '../customer/customer.service';
import { AdService } from '../ad/ad.service';
import { GetQueryAdStatDto, GetStatsDto } from './dto/get.adStat.dto';
import { IAdStat, IStats } from 'core/entities/adStat/adStat.interface';
import { SettingService } from '../setting/setting.service';
import { ICustomer } from 'core/entities/customer/customer.interface';
import { IAd } from 'core/entities/ad/ad.interface';
import { IBusiness } from 'core/entities/business/business.interface';
import { BusinessService } from '../business/business.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('AdStat')
@Controller('')
export class AdStatController {
  constructor(
    private service: AdStatService,
    private customerService: CustomerService,
    private adService: AdService,
    private businessSerivce: BusinessService,
    private settingsService: SettingService,
  ) {}
  singleOutput: SingleOutput<IAdStat> = new SingleOutput<IAdStat>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IAdStat | IStats> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseAdStat,
    description: 'Watch AdStatus',
  })
  @SetPermission(Permission.UpdateAdStats)
  @Post('/watch/:customerId/:adId/')
  async watch(
    @Param() param: CreateParamDto,
    @Body() body: CreateAdStatDto,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }
    const ad = await this.adService.showAd(param.adId);
    if (!ad) {
      return this.errorOutput.notFound(res, 'ad');
    }

    const settings = await this.settingsService.showSetting();

    /** find if sae ad is watched before  */
    const ExistingStat = await this.service.listAdStat(
      {
        ad: ad,
        customer: customer,
      },
      1,
      0,
    );

    /** calculation to not add score again for same ad */
    const reduceScore =
      ExistingStat.length > 0
        ? ExistingStat[0].watched < 99
          ? await settings.fiveSecAdWatchedPoints
          : settings.fullAdWatchedPoints
        : 0;

    const score =
      body.watched > 0
        ? body.watched < 99
          ? await settings.fiveSecAdWatchedPoints
          : settings.fullAdWatchedPoints
        : 0;
    const realScore = reduceScore < score ? score - reduceScore : 0;
    const adStatId =
      ExistingStat.length > 0 ? ExistingStat[0].adStatId : undefined;

    const watchCount =
      ExistingStat.length > 0 ? ExistingStat[0].watchCount + 1 : 0;

    const exisitingClick = ExistingStat.length > 0 ? ExistingStat[0].click : 0;
    const click = exisitingClick + (body.clicked ? 1 : 0);
    /* update ad stats  */
    const adStat = await this.service.watchAdStat({
      ...body,
      adStatId,
      watchCount,
      click,
      customer: customer,
      ad: ad,
    });

    /* add score to customers milestone*/
    if (adStat) {
      await this.customerService.updateCustomer(customer.customerId, {
        milestone: customer.milestone + realScore,
      });
    }
    return this.singleOutput.single(res, adStat, 'Stats', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseAdStat,
    description: 'List all adStat',
  })
  @SetPermission(Permission.ListAdStats)
  @Get('/watch')
  async list(@Res() res: Response, @Query() query: GetQueryAdStatDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    let customer: ICustomer | undefined;
    let ad: IAd | undefined;
    let business: IBusiness | undefined;
    if (query.customerId) {
      customer = await this.customerService.showCustomer(query.customerId);
      if (!customer) {
        return this.errorOutput.notFound(res, 'customer');
      }
    }
    if (query.adId) {
      ad = await this.adService.showAd(query.adId);
      if (!ad) {
        return this.errorOutput.notFound(res, 'ad');
      }
    }

    if (query.businessId) {
      business = await this.businessSerivce.showBusiness(query.businessId);
      if (!business) {
        return this.errorOutput.notFound(res, 'business');
      }
    }
    const where = {
      adStatId: query.adStatId,
      customer,
      ad,
      business,
    };
    const adStat = await this.service.listAdStat(where, limit, offset);
    return this.listOutput.list(
      res,
      adStat,
      'adStat',
      offset,
      limit,
      await this.service.count(where),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseStats,
    description: 'List all adStat',
  })
  @SetPermission(Permission.ListAdStats)
  @Get('/stats')
  async stats(@Res() res: Response, @Query() query: GetStatsDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const stats = await this.service.getStats(query, limit, offset);

    return this.listOutput.list(
      res,
      stats,
      'stats',
      offset,
      limit,
      await this.service.statsCount(query),
    );
  }
}
