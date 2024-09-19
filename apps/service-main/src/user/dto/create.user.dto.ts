import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'TechRender',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'mail@techrender.com',
    required: true,
  })
  @IsEmail()
  email: string;
}
