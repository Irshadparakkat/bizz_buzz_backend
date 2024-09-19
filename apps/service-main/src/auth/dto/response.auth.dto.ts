import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IAd } from 'core/entities/ad/ad.interface';

class TitleDto {
  @ApiProperty({ type: [IAd] })
  business: [IAd];
}

export class ResponseAuth {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: TitleDto;
}
