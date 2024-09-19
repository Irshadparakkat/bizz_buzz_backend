import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class StopTimeDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  stopId: number;

  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number;

  @ApiProperty({
    example: 30,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(59)
  min: number;
}
