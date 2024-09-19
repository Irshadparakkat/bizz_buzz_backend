import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { JourneyStatusEnum } from './create.journey.dto';

export class UpdateJourneyDto {
  @ApiProperty({
    example: JourneyStatusEnum.SUSPENDED,
    enum: JourneyStatusEnum,
    enumName: 'JourneyStatusEnum',
    required: false,
  })
  @IsEnum([JourneyStatusEnum.SUSPENDED])
  status?: JourneyStatusEnum;
}
