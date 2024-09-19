import { ApiProperty } from '@nestjs/swagger';
import { ICustomer } from '../customer/customer.interface';
import { IStop } from '../stop/stop.interface';

export class IFavouriteStop {
  @ApiProperty({
    example: 1,
  })
  favouriteStopId?: number;

  customer?: Partial<ICustomer>;

  stop?: Partial<IStop>;

  createdTime?: Date;
  updatedTime?: Date;
  deletedTime?: Date;
}