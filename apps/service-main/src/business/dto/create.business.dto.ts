import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';

enum BusinessStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateBusinessDto {
  @ApiProperty({
    example: 'TechRender',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'techRender',
    required: false,
  })
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'mail@techrender.com',
    required: true,
  })
  @IsEmail()
  email: string;

 @ApiProperty({
    example: BusinessStatusEnum.ACTIVE,
    enum: BusinessStatusEnum,
    enumName: 'BusinessStatusEnum',
    default: BusinessStatusEnum.ACTIVE,
    required: false,
  })
  @IsEnum(BusinessStatusEnum)
  status?: BusinessStatusEnum = BusinessStatusEnum.ACTIVE;

  @ApiProperty({
    example: '1234567890',
    required: true,
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'IT',
    required: true,
  })
  @IsString()
  businessType: string;

  @ApiProperty({
    example: '123 Street, Area',
    required: false,
  })
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'State',
    required: false,
  })
  @IsString()
  state?: string;

  @ApiProperty({
    example: 'City',
    required: false,
  })
  @IsString()
  city?: string;

  @ApiProperty({
    example: '123456',
    required: false,
  })
  @IsString()
  pincode?: string;

  @ApiProperty({
    example: 'GST123456',
    required: false,
  })
  @IsString()
  gst?: string;

  @ApiProperty({
    example: 'Location Name',
    required: true,
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 12.345678,
    required: true,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: 98.765432,
    required: true,
  })
  @IsNumber()
  longitude: number;
}
