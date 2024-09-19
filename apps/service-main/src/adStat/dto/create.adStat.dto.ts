import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateAdStatDto {
  @ApiProperty({
    example: 5,
    required: true,
  })
  @IsOptional()
  @IsNumber()
  watched: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  clicked: boolean;
}

export class CreateParamDto {
  @ApiProperty({
    name: 'customerId',
    required: true,
    description: 'Id of Customer',
  })
  customerId?: number;

  @ApiProperty({
    name: 'adId',
    required: true,
    description: 'Id of Ad',
  })
  adId?: number;
}
