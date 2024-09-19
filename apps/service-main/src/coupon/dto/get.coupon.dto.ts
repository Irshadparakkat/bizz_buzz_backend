import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCouponParamDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  customerId: number;
}

type CouponStatus = 'Active' | 'Expired' | 'Redeemed';

export class GetQueryCouponDto {
  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit: number;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  offset: number;

  @ApiProperty({
    type: 'enum',
    enum: ['Active', 'Expired', 'Redeemed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Active', 'Expired', 'Redeemed'])
  status: CouponStatus;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  customerId: number;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  coupon: string;
}

export class GetCouponParamDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  couponId: number;
}
