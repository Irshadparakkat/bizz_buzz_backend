import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

enum BusStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateBusDto {
  @ApiProperty({
    example: 'Sugama',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'ABC123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;

  @ApiProperty({
    example: 50,
    required: true,
  })
  @IsInt()
  capacity: number;

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
