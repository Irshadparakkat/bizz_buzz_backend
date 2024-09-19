import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IDriver } from 'core/entities/driver/driver.interface';

class DriverTitleDto {
  @ApiProperty({ type: [IDriver] })
  driver: [IDriver];
}

export class ResponseDriver {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: DriverTitleDto;
}
