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
import { InstantOfferService } from './instantOffer.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IInstantOffer } from 'core/entities/instantOffer/instantOffer.interface';
import { Response } from 'express';
import {
  CreateBusinessParamDto,
  CreateInstantOfferDto,
} from './dto/create.instantOffer.dto';
import { UpdateInstantOfferDto } from './dto/update.instantOffer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInstantOffer } from './dto/response.instantOffer.dto';
import {
  GetParamInstantOfferDto,
  GetQueryInstantOfferDto,
} from './dto/get.instantOffer.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { BusinessService } from '../business/business.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('InstantOffer')
@Controller('')
export class InstantOfferController {
  constructor(
    private service: InstantOfferService,
    private businessService: BusinessService,
  ) {}
  singleOutput: SingleOutput<IInstantOffer> = new SingleOutput<IInstantOffer>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IInstantOffer> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseInstantOffer,
    description: 'Create new InstantOffer',
  })
  @SetPermission(Permission.CreateInstantOffer)
  @Post('business/:businessId/instantOffer')
  async create(
    @Param() param: CreateBusinessParamDto,
    @Body() body: CreateInstantOfferDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    const instantOffer = await this.service.createInstantOffer({
      ...body,
      business: business,
    });
    return this.singleOutput.single(res, instantOffer, 'instantOffer', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseInstantOffer,
    description: 'Get one InstantOffer of business by Id',
  })
  @SetPermission(Permission.GetInstantOffer)
  @Get('business/:businessId/instantOffer/:instantOfferId')
  async showByBusiness(
    @Param() param: GetParamInstantOfferDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    const instantOffer = await this.service.listInstantOffer({
      instantOfferId: param.instantOfferId,
      business: business,
    });
    if (instantOffer.length === 0) {
      return this.errorOutput.notFound(res, 'instantOffer');
    }
    return this.singleOutput.single(res, instantOffer[0], 'instantOffer');
  }

  @ApiResponse({
    status: 200,
    type: ResponseInstantOffer,
    description: 'Get one InstantOffer by Id',
  })
  @SetPermission(Permission.GetInstantOffer)
  @Get()
  async show(@Param() param: GetParamInstantOfferDto, @Res() res: Response) {
    const instantOffer = await this.service.showInstantOffer(
      param.instantOfferId,
    );
    if (!instantOffer) {
      return this.errorOutput.notFound(res, 'instantOffer');
    }
    return this.singleOutput.single(res, instantOffer, 'instantOffer');
  }

  @ApiResponse({
    status: 200,
    type: ResponseInstantOffer,
    description: 'List all instantOffer',
  })
  @SetPermission(Permission.ListInstantOffer)
  @Get('instantOffer')
  async list(@Res() res: Response, @Query() query: GetQueryInstantOfferDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const instantOffer = await this.service.listInstantOffer(
      query,
      limit,
      offset,
    );
    return this.listOutput.list(
      res,
      instantOffer,
      'instantOffer',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseInstantOffer,
    description: 'Get one InstantOffer by Id',
  })
  @SetPermission(Permission.GetInstantOffer)
  @Get('instantOffer/:instantOfferId')
  async showInstantOfferById(
    @Param() param: GetParamInstantOfferDto,
    @Res() res: Response,
  ) {
    const instantOffer = await this.service.showInstantOffer(
      param.instantOfferId,
    );
    if (!instantOffer) {
      return this.errorOutput.notFound(res, 'instantOffer');
    }
    return this.singleOutput.single(res, instantOffer, 'instantOffer');
  }

  @ApiResponse({
    status: 200,
    type: ResponseInstantOffer,
    description: 'List all instantOffer By business',
  })
  @SetPermission(Permission.ListInstantOffer)
  @Get('business/:businessId/instantOffer')
  async listByBusiness(
    @Res() res: Response,
    @Param() param: CreateBusinessParamDto,
    @Query() query: GetQueryInstantOfferDto,
  ) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const business = await this.businessService.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    const instantOffer = await this.service.listInstantOffer(
      {
        ...query,
        business,
      },
      limit,
      offset,
    );
    return this.listOutput.list(
      res,
      instantOffer,
      'instantOffer',
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
    type: ResponseInstantOffer,
    description: 'Update one instantOffer by Id',
  })
  @SetPermission(Permission.UpdateInstantOffer)
  @Put('instantOffer/:instantOfferId')
  async update(
    @Param() param: GetParamInstantOfferDto,
    @Body() body: UpdateInstantOfferDto,
    @Res() res: Response,
  ) {
    const instantOffer = await this.service.updateInstantOffer(
      param.instantOfferId,
      body,
    );
    return this.singleOutput.single(res, instantOffer, 'instantOffer');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete instantOffer by Id',
  })
  @SetPermission(Permission.DeleteInstantOffer)
  @Delete('instantOffer/:instantOfferId')
  async delete(@Param() param: GetParamInstantOfferDto, @Res() res: Response) {
    const instantOffer = await this.service.showInstantOffer(
      param.instantOfferId,
    );
    if (!instantOffer) {
      return this.errorOutput.notFound(res, 'instantOffer');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteInstantOffer(param.instantOfferId),
    );
  }
}
