import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class AdminSigninDto {
  @ApiProperty({
    example: 'mail@techrender.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsString()
  password: string;
}