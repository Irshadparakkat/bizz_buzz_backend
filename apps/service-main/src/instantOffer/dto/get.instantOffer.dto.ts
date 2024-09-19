import { ApiProperty } from '@nestjs/swagger';

export class GetParamInstantOfferDto {
  @ApiProperty({
    name: 'instantOfferId',
    required: true,
    description: 'Id of InstantOffer',
  })
  instantOfferId: number;

  @ApiProperty({
    name: 'businessId',
    required: true,
    description: 'Id of Business',
  })
  businessId?: number;
}

export class GetQueryInstantOfferDto {
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

  @ApiProperty({
    name: 'date',
    required: false,
    type: Date,
    description: 'search by valid to date',
  })
  validTo?: Date;

  @ApiProperty({
    name: 'date',
    required: false,
    type: Date,
    description: 'search by valid from date',
  })
  validFrom?: Date;
}
