import { ApiProperty } from '@nestjs/swagger';

export class GetParamFavouriteStopDto {
  @ApiProperty({
    name: 'favouriteStopId',
    required: false,
    description: 'Id of favouriteStop',
  })
  favouriteStopId?: number;

  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId?: number;

  @ApiProperty({
    name: 'stopId',
    required: false,
    description: 'Id of Stop',
  })
  stopId?: number;
}

export class GetQueryFavouriteStopDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for instantOffer to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from instantOffer list',
  })
  offset?: number;
}