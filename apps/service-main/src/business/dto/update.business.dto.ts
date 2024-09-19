import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

enum BusinessStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class UpdateBusinessDto {
  @ApiProperty({
    example: 'TechRender',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'techRender',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'mail@techrender.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: BusinessStatusEnum.ACTIVE,
    enum: BusinessStatusEnum,
    enumName: 'BusinessStatusEnum',
    default: BusinessStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(BusinessStatusEnum)
  status?: BusinessStatusEnum = BusinessStatusEnum.ACTIVE;

  @ApiProperty({
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: 'IT',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiProperty({
    example: '123 Street, Area',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'State',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    example: 'City',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: '123 Street',
    required: false,
  })
  @IsOptional()
  @IsString()
  street: string;

  @ApiProperty({
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({
    example: 'GST12345687965',
    required: false,
  })
  @IsOptional()
  @IsString()
  gst?: string;

  @ApiProperty({
    example: 'Location Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  location?: string;

  @ApiProperty({
    example: 12.345678,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    example: 98.765432,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
