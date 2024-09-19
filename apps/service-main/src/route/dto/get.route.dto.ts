import { ApiProperty } from '@nestjs/swagger';

export class GetParamRouteDto {
  @ApiProperty({
    name: 'routeId',
    required: true,
    description: 'Id of Route',
  })
  routeId: number;
}

export class GetParamRouteStopDto {
  @ApiProperty({
    name: 'routeId',
    required: true,
    description: 'Id of Route',
  })
  routeId: number;

  @ApiProperty({
    name: 'stopId',
    required: true,
    description: 'Id of Stop',
  })
  stopId: number;
}

export class GetQueryRouteDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for route to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from route list',
  })
  offset?: number;

  @ApiProperty({
    name: 'name',
    required: false,
    type: String,
    description: 'search by name',
  })
  name?: string;
}
