import { ApiProperty } from '@nestjs/swagger';

export class GetParamCustomerDto {
  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId: number;
}

export class GetQueryCustomerDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for customer to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from customer list',
  })
  offset?: number;

  @ApiProperty({
    name: 'name',
    required: false,
    type: String,
    description: 'search by name',
  })
  name?: string;

  @ApiProperty({
    name: 'email',
    required: false,
    type: String,
    description: 'search by email',
  })
  email?: string;
}
