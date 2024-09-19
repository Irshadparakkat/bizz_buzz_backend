import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum JourneyStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateJourneyDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  tripId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  driverId: number;

  @ApiProperty({
    example: JourneyStatusEnum.ACTIVE,
    enum: JourneyStatusEnum,
    enumName: 'JourneyStatusEnum',
    default: JourneyStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum([JourneyStatusEnum.ACTIVE])
  status?: JourneyStatusEnum = JourneyStatusEnum.ACTIVE;
}
