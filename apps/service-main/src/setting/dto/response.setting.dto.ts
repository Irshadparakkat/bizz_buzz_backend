import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { ISetting } from 'core/entities/setting/setting.interface';

class TitleSettingDto {
  @ApiProperty({ type: [ISetting] })
  setting: [ISetting];
}

export class ResponseSetting {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: TitleSettingDto;
}
