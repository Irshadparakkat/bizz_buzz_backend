import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IJourney } from 'core/entities/journey/journey.interface';

class JourneyTitleDto {
  @ApiProperty({ type: [IJourney] })
  journey: [IJourney];
}

export class ResponseJourney {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: JourneyTitleDto;
}
