import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddStopDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  order: number;
}

export class addStopsDto {
  @ApiProperty({
    type: [AddStopDto],
    example: [
      {
        name: 'stop name',
        location: '123 Main St',
        latitude: 45.764043,
        longitude: 4.835659,
      },
      {
        name: 'stop name',
        location: '123 Main St',
        latitude: 45.764043,
        longitude: 4.835659,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddStopDto)
  stops: AddStopDto[];
}

export class AddStopOrder {
  @IsNumber()
  order: number;
}
