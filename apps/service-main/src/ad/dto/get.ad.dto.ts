import { ApiProperty } from '@nestjs/swagger';

export class GetBusinessAdParamDto {
  @ApiProperty({
    name: 'adId',
    required: true,
    description: 'Id of Ad',
  })
  adId?: number;

  @ApiProperty({
    name: 'businessId',
    required: true,
    description: 'Id of Business',
  })
  businessId?: number;
}

export class GetAdParamDto {
  @ApiProperty({
    name: 'adId',
    required: true,
    description: 'Id of Ad',
  })
  adId?: number;
}

export class GetQueryAdDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for ad to list',
  })
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from ad list',
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
    name: 'category',
    required: false,
    type: String,
    description: 'search by category',
  })
  category?: string;

  @ApiProperty({
    name: 'latitude',
    required: false,
    description: 'current user latitude to find perfect ad for the user ',
  })
  latitude?: number;

  @ApiProperty({
    name: 'longitude',
    required: false,
    description: 'current user longitude to find perfect ad for the user ',
  })
  longitude?: number;

  @ApiProperty({
    name: 'customerId',
    required: false,
    type: Number,
    description: 'to get liked status of Ad',
  })
  customerId?: number;
}
