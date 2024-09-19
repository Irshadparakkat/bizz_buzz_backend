import { ApiProperty } from '@nestjs/swagger';

export class GetParamBusDto {
  @ApiProperty({
    name: 'busId',
    required: true,
    description: 'Id of Bus',
  })
  busId: number;
}

export class GetQueryBusDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for bus to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from bus list',
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
    name: 'driverId',
    required: false,
    type: String,
    description: 'search by driverId',
  })
  driverId?: number;
}
