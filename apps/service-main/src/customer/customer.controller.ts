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
import { CustomerService } from './customer.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { ICustomer } from 'core/entities/customer/customer.interface';
import { Response } from 'express';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseCustomer } from './dto/response.customer.dto';
import {
  GetParamCustomerDto,
  GetQueryCustomerDto,
} from './dto/get.customer.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { SettingService } from '../setting/setting.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@UseGuards(AuthGuard)
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private service: CustomerService,
    private settingService: SettingService,
  ) {}
  singleOutput: SingleOutput<ICustomer> = new SingleOutput<ICustomer>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<ICustomer> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'Create new Customer',
  })
  @SetPermission(Permission.CreateCustomer)
  @Post()
  async create(@Body() body: CreateCustomerDto, @Res() res: Response) {
    const condition: Partial<ICustomer>[] = [];
    body.email && condition.push({ email: body.email });
    body.phoneNumber && condition.push({ email: body.phoneNumber });
    const existingUser = await this.service.listCustomer(condition);
    if (existingUser.length > 0) {
      const badReq = [];
      existingUser[0].email == body.email && badReq.push('email already exist');
      existingUser[0].phoneNumber == body.phoneNumber &&
        badReq.push('phoneNumber already exist');
      throw this.errorOutput.badRequestError(res, badReq);
    }
    const customer = await this.service.createCustomer(body);
    return this.singleOutput.single(res, customer, 'customer', true);
  }

  @ApiResponse({
    status: 200,
    type: ResponseCustomer,
    description: 'Get one Customer by Id',
  })
  @SetPermission(Permission.GetCustomer)
  @Get(':customerId')
  async show(@Param() param: GetParamCustomerDto, @Res() res: Response) {
    const customer = await this.service.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }
    const settings = await this.settingService.showSetting();
    return this.singleOutput.single(
      res,
      {
        ...customer,
        availableAmount: Math.floor(
          customer.milestone / settings.minConversionPoints,
        ),
      },
      'customer',
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseCustomer,
    description: 'List all customer',
  })
  @SetPermission(Permission.ListCustomer)
  @Get()
  async list(@Res() res: Response, @Query() query: GetQueryCustomerDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const customer = await this.service.listCustomer(query, limit, offset);
    return this.listOutput.list(
      res,
      customer,
      'customer',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseCustomer,
    description: 'Update one Customer by Id',
  })
  @SetPermission(Permission.UpdateCustomer)
  @Put(':customerId')
  async update(
    @Param() param: GetParamCustomerDto,
    @Body() body: UpdateCustomerDto,
    @Res() res: Response,
  ) {
    const condition: Partial<ICustomer>[] = [];
    body.email && condition.push({ email: body.email });
    body.phoneNumber && condition.push({ email: body.phoneNumber });
    const existingUser = (await this.service.listCustomer(condition)).filter(
      (customer) => customer.customerId != param.customerId,
    );
    if (existingUser.length > 0) {
      const badReq = [];
      existingUser[0].email == body.email && badReq.push('email already exist');
      existingUser[0].phoneNumber == body.phoneNumber &&
        badReq.push('phoneNumber already exist');
      throw this.errorOutput.badRequestError(res, badReq);
    }
    const customer = await this.service.updateCustomer(param.customerId, body);
    return this.singleOutput.single(res, customer, 'customer');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete Customer by Id',
  })
  @SetPermission(Permission.DeleteCustomer)
  @Delete(':customerId')
  async delete(@Param() param: GetParamCustomerDto, @Res() res: Response) {
    const customer = await this.service.showCustomer(param.customerId);
    if (!customer) {
      return this.errorOutput.notFound(res, 'customer');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteCustomer(param.customerId),
    );
  }
}
