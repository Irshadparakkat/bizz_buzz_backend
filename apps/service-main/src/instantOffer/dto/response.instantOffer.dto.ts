import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IInstantOffer } from 'core/entities/instantOffer/instantOffer.interface';

class TitleInstantOfferDto {
  @ApiProperty({ type: [IInstantOffer] })
  instantOffer: [IInstantOffer];
}

export class ResponseInstantOffer {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: TitleInstantOfferDto;
}
