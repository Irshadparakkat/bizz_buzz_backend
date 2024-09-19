import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IStop } from 'core/entities/stop/stop.interface';

class TitleStopDto {
  @ApiProperty({ type: [IStop] })
  stop: [IStop];
}

export class ResponseStop {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: TitleStopDto;
}
