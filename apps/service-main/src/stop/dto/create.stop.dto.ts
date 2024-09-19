import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStopDto {
  @ApiProperty({
    example: 'Hebbal',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'hebbal,Banglore',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: '37.2345',
    required: true,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: '17.2785',
    required: true,
  })
  @IsNumber()
  longitude: number;
}
