import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteAdDto {
  @ApiProperty({
    name: 'adId',
    required: true,
    description: 'Id of Ad',
  })
  adId?: number;
}

export class CreatefavouriteAdParamDto {
  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId?: number;
}
