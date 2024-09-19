import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteStopDto {
  @ApiProperty({
    name: 'stopId',
    required: true,
    description: 'Id of Stop',
  })
  stopId?: number;
}

export class CreatefavouriteStopParamDto {
  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId?: number;
}
