import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateRouteDto {
  @ApiPropertyOptional({
    example: 'TechRender',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: 'Via location',
    required: false,
  })
  @IsString()
  @IsOptional()
  via?: string;
}
