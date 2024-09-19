import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';

enum DriverStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateDriverDto {
  @ApiProperty({
    example: 'Arafath',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'arafath@techrender.ai',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    required: true,
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: DriverStatusEnum.ACTIVE,
    enum: DriverStatusEnum,
    enumName: 'DriverStatusEnum',
    default: DriverStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(DriverStatusEnum)
  status?: DriverStatusEnum = DriverStatusEnum.ACTIVE;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'A+',
    required: true,
  })
  @IsString()
  bloodGroup?: string;

  @ApiProperty({
    example: 'unwilling',
    required: false,
  })
  @IsString()
  donationStatus?: string = 'unwilling';
}

export class AssignBusDto {
  @ApiProperty({
    name: 'driverId',
    required: true,
    description: 'Id of driver'
  })
  @IsNumber()
  driverId?: number;

  @ApiProperty({
    name: 'busId',
    description: 'Id of bus',
    required: true,
  })
  @IsNumber()
  busId?: number;
}
