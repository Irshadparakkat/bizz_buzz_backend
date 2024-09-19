import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNumber()
  amount: number;
}
