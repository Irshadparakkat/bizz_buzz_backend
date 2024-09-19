import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

enum CustomerStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateCustomerDto {
  @ApiProperty({
    example: 'TechRender',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Tech@123',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'mail@techrender.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: CustomerStatusEnum.ACTIVE,
    enum: CustomerStatusEnum,
    enumName: 'CustomerStatusEnum',
    default: CustomerStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(CustomerStatusEnum)
  status?: CustomerStatusEnum = CustomerStatusEnum.ACTIVE;

  @ApiProperty({
    example: '+91 1234567890',
    required: true,
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsString()
  bloodGroup: string = '';

  @ApiProperty({
    example: 'unwilling',
    required: false,
  })
  @IsString()
  donationStatus?: string = 'unwilling';
}
