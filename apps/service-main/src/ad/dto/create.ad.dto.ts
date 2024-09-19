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

export class CreateAdDto {
  @ApiProperty({
    example: 'TechRender',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: AdCategoryEnum.STANDERD,
    enum: AdCategoryEnum,
    enumName: 'AdCategoryEnum',
    required: true,
  })
  @IsEnum(AdCategoryEnum)
  category: AdCategoryEnum;

  @ApiProperty({
    example: '27-05-2024',
    required: true,
  })
  @IsDate()
  validFrom: Date;

  @ApiProperty({
    example: '27-05-2024',
    required: true,
  })
  @IsDate()
  validTo: Date;

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
    example: '10',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  adRange: number;

  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/v8A7F4VCAAAAABJRU5ErkJggg==',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  adUrl: string;

  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/v8A7F4VCAAAAABJRU5ErkJggg==',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/v8A7F4VCAAAAABJRU5ErkJggg==',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sqrThumbnailUrl: string;
}

export class CreateBusinessParamDto {
  @ApiProperty({
    name: 'businessId',
    required: true,
    description: 'Id of Business',
  })
  businessId?: number;
}
