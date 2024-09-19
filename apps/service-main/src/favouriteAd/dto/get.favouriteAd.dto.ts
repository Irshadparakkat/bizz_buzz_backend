import { ApiProperty } from '@nestjs/swagger';

export class GetParamFavouriteAdDto {
  @ApiProperty({
    name: 'favouriteAdId',
    required: false,
    description: 'Id of favouriteAd',
  })
  favouriteAdId?: number;

  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId?: number;

  @ApiProperty({
    name: 'adId',
    required: false,
    description: 'Id of Ad',
  })
  adId?: number;
}

export class GetQueryFavouriteAdDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for favoriteAd to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from favoriteAd list',
  })
  offset?: number;
}