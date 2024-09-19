import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IAd } from 'core/entities/ad/ad.interface';

class CouponTitleDto {
  @ApiProperty({ type: [IAd] })
  coupon: [IAd];
}

export class ResponseCoupon {
  @ApiResponseProperty({
    example: true,
  })
  status: boolean;

  @ApiResponseProperty()
  data: CouponTitleDto;
}
