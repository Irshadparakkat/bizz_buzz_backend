import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { StopTimeDto } from './stop.time.dto';
import { TripStatusEnum } from './create.trip.dto';

export class UpdateTripDto {
  @ApiProperty({
    example: 'trip name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tripName: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
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
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StopTimeDto)
  stopTime: StopTimeDto[];
}
