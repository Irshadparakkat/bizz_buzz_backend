import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RedemeCouponDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  businessId: number;

  @ApiProperty({
    example: 'ASDH1',
    required: true,
  })
  @IsString()
  coupon: string;
}
