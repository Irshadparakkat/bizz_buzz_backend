import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum StatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

enum AdCategoryEnum {
  STANDERD = 'Standard',
  PREMIUM = 'Premium',
}

export class UpdateAdDto {
  @ApiProperty({
    example: 'TechRender',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: AdCategoryEnum.STANDERD,
    enum: AdCategoryEnum,
    enumName: 'AdCategoryEnum',
    required: false,
  })
  @IsOptional()
  @IsEnum(AdCategoryEnum)
  category?: AdCategoryEnum;

  @ApiProperty({
    example: '27-05-2024',
    required: true,
  })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  validFrom: Date;

  @ApiProperty({
    example: '12:00',
    required: true,
  })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  validTo: Date;

  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  adRange: number;

  @ApiProperty({
    example: StatusEnum.ACTIVE,
    enum: StatusEnum,
    enumName: 'StatusEnum',
    default: StatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum = StatusEnum.ACTIVE;

  @ApiProperty({
    example: 'adurl',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  adUrl: string;

  @ApiProperty({
    example: 'thumbnailurl',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({
    example: 'sqrthumbnailurl',
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sqrThumbnailUrl: string;
}
