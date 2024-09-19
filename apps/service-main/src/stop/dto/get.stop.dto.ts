import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetParamStopDto {
  @ApiProperty({
    name: 'stopId',
    required: true,
    description: 'Id of Stop',
  })
  stopId: number;
}

export class GetQueryStopDto {
  @ApiProperty({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit for stop to list',
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    name: 'offset',
    required: false,
    type: Number,
    description: 'number of items to skip from stop list',
  })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiProperty({
    name: 'name',
    required: false,
    type: String,
    description: 'search by stop name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    name: 'latitude',
    required: false,
    type: Number,
    description: 'search by latitude',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    name: 'longitude',
    required: false,
    type: Number,
    description: 'search by longitude',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    name: 'myLatitude',
    required: false,
    type: Number,
    description: 'order by nearest location',
  })
  @IsOptional()
  @IsNumber()
  myLatitude?: number;

  @ApiProperty({
    name: 'myLongitude',
    required: false,
    type: Number,
    description: 'order by nearest location',
  })
  @IsOptional()
  @IsNumber()
  myLongitude?: number;

  @ApiProperty({
    name: 'customerId',
    required: false,
    type: Number,
    description: 'to get liked status of Ad',
  })
  customerId?: number;
}
