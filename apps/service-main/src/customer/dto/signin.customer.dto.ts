import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class signinCustomerDto {
  @ApiProperty({
    example: '+91 01234567890',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'asdfA@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class verifyCustomerDto {
  @ApiProperty({
    example: '+91 01234567890',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'asdfA@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class forgotPasswordCustomerDto {
  @ApiProperty({
    example: '+91 01234567890',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}

export class resetPasswordCustomerDto {
  @ApiProperty({
    example: '+91 01234567890',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'asdfA@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
