import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetCustomerAdStatsParamDto {
  @ApiProperty({
    name: 'adStatId',
    required: true,
    description: 'Id of AdStat',
  })
  adStatId?: number;

  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId?: number;

  @ApiProperty({
    name: 'adId',
    required: true,
    description: 'Id of Ad',
  })
  adId?: number;
}

export class GetQueryAdStatDto {
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
    name: 'adStatId',
    required: false,
    type: String,
    description: 'search by Id',
  })
  adStatId?: number;

  @ApiProperty({
    name: 'businessId',
    required: false,
    type: Number,
    description: 'stats by businessId',
  })
  businessId?: number;

  @ApiProperty({
    name: 'adId',
    required: false,
    type: Number,
    description: 'stats by adId',
  })
  adId?: number;

  @ApiProperty({
    name: 'customerId',
    required: false,
    type: Number,
    description: 'stats by customerId',
  })
  customerId?: number;
}

export class GetStatsDto {
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
    name: 'businessId',
    required: false,
    type: Number,
    description: 'stats by businessId',
  })
  businessId?: number;

  @ApiProperty({
    name: 'adId',
    required: false,
    type: Number,
    description: 'stats by adId',
  })
  adId?: number;

  @ApiProperty({
    name: 'adId',
    required: false,
    type: Number,
    description: 'stats by customerId',
  })
  customerId?: number;

  @ApiProperty({
    name: 'adId',
    required: false,
    type: 'enum',
    enum: ['ad', 'business', 'customer'],
    description: 'stats by customerId',
  })
  @IsOptional()
  @IsEnum(['ad', 'business', 'customer'])
  breakdown?: 'ad' | 'business' | 'customer';
}
