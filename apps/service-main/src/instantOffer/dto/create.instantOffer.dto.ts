import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

enum IOfferStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class CreateInstantOfferDto {
  @ApiProperty({
    example: 'we’re offering 10% off all purchases using code THANKS10',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '27-05-2024',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  validFrom: Date;

  @ApiProperty({
    example: '27-05-2024',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  validTo: Date;

  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  instantOfferRange: string;

  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  userCount: number;

  @ApiProperty({
    example: IOfferStatusEnum.ACTIVE,
    enum: IOfferStatusEnum,
    enumName: 'IOfferStatusEnum',
    required: true,
  })
  @IsEnum(IOfferStatusEnum)
  status: IOfferStatusEnum
}

export class CreateBusinessParamDto {
  @ApiProperty({
    name: 'businessId',
    required: true,
    description: 'Id of Business',
  })
  businessId?: number;
}
