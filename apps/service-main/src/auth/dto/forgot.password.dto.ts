import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'mail@techrender.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
