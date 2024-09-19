import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StopTimeDto } from './stop.time.dto';

export enum TripStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateTripDto {
  @ApiProperty({
    example: 'trip name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripName: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  routeId: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  busId?: number;

  @ApiProperty({
    example: TripStatusEnum.ACTIVE,
    enum: TripStatusEnum,
    enumName: 'TripStatusEnum',
    default: TripStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(TripStatusEnum)
  status?: TripStatusEnum = TripStatusEnum.ACTIVE;

  @ApiProperty({
    type: [StopTimeDto],
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => StopTimeDto)
  stopTime: StopTimeDto[];
}
