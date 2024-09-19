import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';

enum CustomerStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class UpdateCustomerDto {
  @ApiProperty({
    example: 'TechRender',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Tech@123',
    required: false,
  })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'mail@techrender.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: CustomerStatusEnum.ACTIVE,
    enum: CustomerStatusEnum,
    enumName: 'CustomerStatusEnum',
    default: CustomerStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(CustomerStatusEnum)
  status?: CustomerStatusEnum;

  @ApiProperty({
    example: '+91 1234567890',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @ApiProperty({
    example: 'unwilling',
    required: false,
  })
  @IsString()
  @IsOptional()
  donationStatus?: string;
}
