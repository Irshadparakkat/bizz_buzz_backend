import { ApiProperty } from '@nestjs/swagger';

export class GetParamBusinessDto {
  @ApiProperty({
    name: 'businessId',
    required: true,
    description: 'Id of business',
  })
  businessId: number;
}

export class GetQueryBusinessDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for business to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from business list',
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

  @ApiProperty({
    name: 'status',
    required: false,
    type: String,
    description: 'search by status',
  })
  status?: string;
}
