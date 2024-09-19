import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'TechRender@123',
    required: true,
  })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
