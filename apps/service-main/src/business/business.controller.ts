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
import { BusinessService } from './business.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IBusiness } from 'core/entities/business/business.interface';
import { Response } from 'express';
import { CreateBusinessDto } from './dto/create.business.dto';
import { UpdateBusinessDto } from './dto/update.business.dto';
import {
  GetParamBusinessDto,
  GetQueryBusinessDto,
} from './dto/get.business.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseBusiness } from './dto/response.business.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private service: BusinessService) {}
  singleOutput: SingleOutput<IBusiness> = new SingleOutput<IBusiness>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IBusiness> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseBusiness,
    description: 'Create new Business',
  })
  @SetPermission(Permission.CreateBusiness)
  @Post()
  async create(@Body() body: CreateBusinessDto, @Res() res: Response) {
    const existingBusiness = await this.service.listBusiness([
      {
        username: body.username,
      },
      {
        phoneNumber: body.phoneNumber,
      },
      {
        email: body.email,
      },
    ]);
    if (existingBusiness.length > 0) {
      const badReq = [];
      existingBusiness[0].email == body.email &&
        badReq.push('Email already exist');
      existingBusiness[0].phoneNumber == body.phoneNumber &&
        badReq.push('Phone number already exist');
      existingBusiness[0].username == body.username &&
        badReq.push('Username already exist');
      throw this.errorOutput.badRequestError(res, badReq);
    }
    const business = await this.service.createBusiness(body);
    return this.singleOutput.single(res, business, 'business', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseBusiness,
    description: 'Get one Business by Id',
  })
  @SetPermission(Permission.GetBusiness)
  @Get(':businessId')
  async show(@Param() param: GetParamBusinessDto, @Res() res: Response) {
    const business = await this.service.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    return this.singleOutput.single(res, business, 'business');
  }

  @ApiResponse({
    status: 200,
    type: ResponseBusiness,
    description: 'List all business',
  })
  @SetPermission(Permission.ListBusiness)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryBusinessDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const business = await this.service.listBusiness(query, limit, offset);
    return this.listOutput.list(
      res,
      business,
      'business',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseBusiness,
    description: 'Update one Business by Id',
  })
  @SetPermission(Permission.UpdateBusiness)
  @Put(':businessId')
  async update(
    @Param() param: GetParamBusinessDto,
    @Body() body: UpdateBusinessDto,
    @Res() res: Response,
  ) {
    const existingBusiness = (
      await this.service.listBusiness([
        {
          username: body.username,
        },
        {
          phoneNumber: body.phoneNumber,
        },
        {
          email: body.email,
        },
      ])
    ).filter((business) => business.businessId != param.businessId);
    if (existingBusiness.length > 0) {
      const badReq = [];
      existingBusiness[0].email == body.email &&
        badReq.push('email already exist');
      existingBusiness[0].phoneNumber == body.phoneNumber &&
        badReq.push('phoneNumber already exist');
      existingBusiness[0].username == body.username &&
        badReq.push('username already exist');
      throw this.errorOutput.badRequestError(res, badReq);
    }
    const business = await this.service.updateBusiness(param.businessId, body);
    return this.singleOutput.single(res, business, 'business');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete Business by Id',
  })
  @SetPermission(Permission.DeleteBusiness)
  @Delete(':businessId')
  async delete(@Param() param: GetParamBusinessDto, @Res() res: Response) {
    const business = await this.service.showBusiness(param.businessId);
    if (!business) {
      return this.errorOutput.notFound(res, 'business');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteBusiness(param.businessId),
    );
  }
}
