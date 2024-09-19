import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';

enum DriverStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class UpdateDriverDto {
  @ApiProperty({
    example: 'Arafath',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'arafath@techrender.ai',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

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
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({
    example: 'A+',
    required: false,
  })
  @IsString()
  @IsOptional()
  bloodGroup: string;

  @ApiProperty({
    example: 'no',
    required: false,
  })
  @IsString()
  @IsOptional()
  donationStatus: string;
}
