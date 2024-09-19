import { ApiProperty } from '@nestjs/swagger';

export class GetParamTripDto {
  @ApiProperty({
    name: 'tripId',
    required: true,
    description: 'Id of Trip',
  })
  tripId: number;
}

export class GetQueryTripDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for trip to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from trip list',
  })
  offset?: number;

  @ApiProperty({
    name: 'trip name',
    required: false,
    type: String,
    description: 'search by trip name',
  })
  name?: string;

  @ApiProperty({
    name: 'busId',
    required: false,
    type: String,
    description: 'search by busId',
  })
  busId?: number;

  @ApiProperty({
    name: 'busName',
    required: false,
    type: String,
    description: 'search by busName',
  })
  busName?: string;

  @ApiProperty({
    name: 'routeId',
    required: false,
    type: String,
    description: 'search by route id',
  })
  routeId?: number;

  @ApiProperty({
    name: 'routeName',
    required: false,
    type: String,
    description: 'search by route name',
  })
  routeName?: string;

  commenName?: string;

  @ApiProperty({
    name: 'from',
    required: false,
    description:
      'from StopId, to is reuired to add this filter ,  also it will filter the trip that not yet reached to the from stop',
  })
  from?: number;

  @ApiProperty({
    name: 'to',
    required: false,
    description: 'to StopId from is reuired to add this filter',
  })
  to?: number;
}
