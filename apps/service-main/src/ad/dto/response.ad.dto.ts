import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IAd } from 'core/entities/ad/ad.interface';

class AdTitleDto {
  @ApiProperty({ type: [IAd] })
  ad: [IAd];
}

export class ResponseAd {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: AdTitleDto;
}
