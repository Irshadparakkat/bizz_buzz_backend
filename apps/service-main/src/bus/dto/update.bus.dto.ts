import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

enum BusStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class UpdateBusDto {
  @ApiProperty({
    example: 'Sugama',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 'ABC123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vehicleNumber?: string;

  @ApiProperty({
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiProperty({
    example: BusStatusEnum.ACTIVE,
    enum: BusStatusEnum,
    enumName: 'BusStatusEnum',
    default: BusStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(BusStatusEnum)
  status?: BusStatusEnum = BusStatusEnum.ACTIVE;
}
