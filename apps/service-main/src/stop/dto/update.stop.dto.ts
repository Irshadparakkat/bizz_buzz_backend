import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStopDto {
  @ApiProperty({
    example: 'Hebbal',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'hebbal,Banglore',
    required: false,
  })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({
    example: '37.2345',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: '17.2785',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude: number;
}
