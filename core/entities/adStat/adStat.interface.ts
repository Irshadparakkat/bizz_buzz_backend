import { ApiProperty } from '@nestjs/swagger';
import { ICustomer } from '../customer/customer.interface';
import { IAd } from '../ad/ad.interface';
import { IBusiness } from '../business/business.interface';

export class IAdStat {
  @ApiProperty({
    example: 1,
  })
  adStatId?: number;

  @ApiProperty({
    example: 5,
  })
  watched: number;

  @ApiProperty({
    example: 5,
  })
  watchCount?: number;

  @ApiProperty({
    example: 3,
  })
  click?: number;

  customer: ICustomer;

  ad: Partial<IAd>;

  business?: IBusiness; // for search
  createdTime?: Date;
  updatedTime?: Date;
}

export class IStats {
  businessId?: number;

  adId?: number;

  customerId?: number;

  click?: number;

  view?: number;

  reach?: number;

  breakdown?: 'ad' | 'business' | 'customer';
}
