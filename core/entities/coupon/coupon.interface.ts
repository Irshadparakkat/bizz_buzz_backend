import { ApiProperty } from '@nestjs/swagger';
import { ICustomer } from '../customer/customer.interface';
import { IBusiness } from '../business/business.interface';

export class ICoupon {
  @ApiProperty({
    example: 1,
  })
  couponId?: number;

  @ApiProperty({
    example: 5,
  })
  amount: number;

  customer: ICustomer;

  business?: Partial<IBusiness>;

  coupon?: string;

  point?: number;

  redemedTime?: Date;

  redemedStatus?: boolean;

  expired?: boolean;

  status?: string;

  validity: Date;

  createdTime?: Date;
  updatedTime?: Date;
}
