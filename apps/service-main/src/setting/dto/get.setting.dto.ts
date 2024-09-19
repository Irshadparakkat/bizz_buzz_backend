import { ApiProperty } from '@nestjs/swagger';

export class GetParamSettingDto {
  @ApiProperty({
    name: 'settingId',
    required: true,
    description: 'Id of Setting',
  })
  settingId: number;
}
