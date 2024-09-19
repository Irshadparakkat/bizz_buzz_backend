import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({
    example: 'TechRender',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Via location',
    required: true,
  })
  @IsString()
  via: string;
}
