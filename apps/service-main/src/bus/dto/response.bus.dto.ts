import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IBus } from 'core/entities/bus/bus.interface';

class BusTitleDto {
  @ApiProperty({ type: [IBus] })
  bus: [IBus];
}

export class ResponseBus {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: BusTitleDto;
}
