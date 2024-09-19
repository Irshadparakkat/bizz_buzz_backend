import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGoogleSignUpDto {
  @ApiProperty({
    example: 'sdagfblksda.nfoisvfsdfiudsgfjk',
    required: true,
  })
  @IsString()
  token: string;
}
