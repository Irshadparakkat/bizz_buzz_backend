import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IBusiness } from 'core/entities/business/business.interface';

class TitleDto {
  @ApiProperty({ type: [IBusiness] })
  business: [IBusiness];
}

export class ResponseBusiness {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: TitleDto;
}
