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
import { AdService } from './ad.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IAd } from 'core/entities/ad/ad.interface';
import { Response } from 'express';
import { CreateAdDto, CreateBusinessParamDto } from './dto/create.ad.dto';
import { UpdateAdDto } from './dto/update.ad.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAd } from './dto/response.ad.dto';
import {
  GetAdParamDto,
  GetBusinessAdParamDto,
  GetQueryAdDto,
} from './dto/get.ad.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { BusinessService } from '../business/business.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Ad')
@Controller('')
export class AdController {
  constructor(
    private service: AdService,
    private businessService: BusinessService,
  ) { }
  singleOutput: SingleOutput<IAd> = new SingleOutput<IAd>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IAd> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseAd,
    description: 'Create new Ad',
  })
  @SetPermission(Permission.CreateAd)
  @Post('business/:businessId/ad')
  async create(
    @Param() param: CreateBusinessParamDto,
    @Body() body: CreateAdDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    const ad = await this.service.createAd({
      ...body,
      business: business,
    });
    return this.singleOutput.single(res, ad, 'ad', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseAd,
    description: 'Get one Ad of business by Id',
  })
  @SetPermission(Permission.GetAd)
  @Get('business/:businessId/ad/:adId')
  async showByBusiness(
    @Param() param: GetBusinessAdParamDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    const ad = await this.service.listAd({
      adId: param.adId,
      business: business,
    });
    if (ad.length === 0) {
      return this.errorOutput.notFound(res, 'ad');
    }
    return this.singleOutput.single(res, ad[0], 'ad');
  }

  @ApiResponse({
    status: 200,
    type: ResponseAd,
    description: 'Update one ad by Id',
  })
  @SetPermission(Permission.UpdateAd)
  @Put('business/:businessId/ad/:adId')
  async updateByBusiness(
    @Param() param: GetBusinessAdParamDto,
    @Body() body: UpdateAdDto,
    @Res() res: Response,
  ) {
    const { businessId, adId } = param;

    const business = await this.businessService.showBusiness(businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }

    const ad = await this.service.listAd({
      adId: adId,
      business: business,
    });
    if (ad.length === 0) {
      return this.errorOutput.notFound(res, 'ad');
    }

    const { adUrl, thumbnailUrl, sqrThumbnailUrl } = ad[0];
    // Update adUrl if different
    if (adUrl != body.adUrl) {
      body.adUrl = await this.service.uploadToCloudinary(body.adUrl);
    }
    if (thumbnailUrl != body.thumbnailUrl) {
      body.thumbnailUrl = await this.service.uploadToCloudinary(
        body.thumbnailUrl,
      );
    }
    if (sqrThumbnailUrl != body.sqrThumbnailUrl) {
      body.sqrThumbnailUrl = await this.service.uploadToCloudinary(
        body.sqrThumbnailUrl,
      );
    }

    const updatedAd = await this.service.updateAd(adId, body);
    return this.singleOutput.single(res, updatedAd, 'ad');
  }

  @ApiResponse({
    status: 200,
    type: ResponseAd,
    description: 'Update one ad by Id',
  })
  @SetPermission(Permission.UpdateAd)
  @Put('ad/:adId')
  async update(
    @Param() param: GetAdParamDto,
    @Body() body: UpdateAdDto,
    @Res() res: Response,
  ) {
    const ad = await this.service.updateAd(param.adId, body);
    return this.singleOutput.single(res, ad, 'ad');
  }

  @ApiResponse({
    status: 200,
    type: ResponseAd,
    description: 'List all ad',
  })
  @SetPermission(Permission.ListAd)
  @Get('ad')
  async list(@Res() res: Response, @Query() query: GetQueryAdDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    const latitude = query.latitude;
    const longitude = query.longitude;
    const busAd = query.busAd ?? false;

    delete query.latitude;
    delete query.longitude;
    delete query.limit;
    delete query.offset;
    const ad = await this.service.listAd(
      query,
      limit,
      offset,
      latitude,
      longitude,
      busAd
    );
    return this.listOutput.list(
      res,
      ad,
      'ad',
      offset,
      limit,
      await this.service.count(query, latitude, longitude),
    );
  }
  @ApiResponse({
    status: 200,
    type: ResponseAd,
    description: 'List all ad By business',
  })
  @SetPermission(Permission.ListAd)
  @Get('business/:businessId/ad')
  async listByBusiness(
    @Res() res: Response,
    @Param() param: CreateBusinessParamDto,
    @Query() query: GetQueryAdDto,
  ) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const business = await this.businessService.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    const ad = await this.service.listAd(
      {
        ...query,
        business,
      },
      limit,
      offset,
    );
    return this.listOutput.list(
      res,
      ad,
      'ad',
      offset,
      limit,
      await this.service.count({
        ...query,
        business,
      }),
    );
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete ad by Id',
  })
  @SetPermission(Permission.DeleteAd)
  @Delete('ad/:adId')
  async delete(@Param() param: GetAdParamDto, @Res() res: Response) {
    const ad = await this.service.showAd(param.adId);
    if (!ad) {
      return this.errorOutput.notFound(res, 'ad');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteAd(param.adId),
    );
  }
}
