import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum IOfferStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class UpdateInstantOfferDto {
  @ApiProperty({
    example: 'we’re offering 10% off all purchases using code THANKS10',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '27-05-2024',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  validFrom: Date;

  @ApiProperty({
    example: '27-05-2024',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  validTo: Date;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  instantOfferRange: string;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  userCount: number;

  @ApiProperty({
    example: IOfferStatusEnum.ACTIVE,
    enum: IOfferStatusEnum,
    enumName: 'IOfferStatusEnum',
    default: IOfferStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(IOfferStatusEnum)
  status?: IOfferStatusEnum = IOfferStatusEnum.ACTIVE;
}
