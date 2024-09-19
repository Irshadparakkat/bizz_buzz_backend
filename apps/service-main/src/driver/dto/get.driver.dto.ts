import { ApiProperty } from '@nestjs/swagger';

export class GetParamDriverDto {
  @ApiProperty({
    name: 'driverId',
    required: true,
    description: 'Id of Driver',
  })
  driverId: number;
}

export class GetQueryDriverDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for driver to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from driver list',
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
