import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IAdStat } from 'core/entities/adStat/adStat.interface';

class AdStatTitleDto {
  @ApiProperty({ type: [IAdStat] })
  adStat: [IAdStat];
}

export class ResponseAdStat {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: AdStatTitleDto;
}

export class ResponseStats {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: [];
}
