import { ApiProperty } from '@nestjs/swagger';
import { ICustomer } from '../customer/customer.interface';
import { IAd } from '../ad/ad.interface';

export class IFavouriteAd {
  @ApiProperty({
    example: 1,
  })
  favouriteAdId?: number;

  customer?: Partial<ICustomer>;

  ad?: Partial<IAd>;

  createdTime?: Date;
  updatedTime?: Date;
  deletedTime?: Date;
}