import { ECustomer } from 'core/repositories/customer/typeorm/customer.entity';
import { EAd } from 'core/repositories/ad/typeorm/ad.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'favouriteAd' })
export class EFavouriteAd {
  @PrimaryGeneratedColumn()
  favouriteAdId: number;

  @ManyToOne(() => ECustomer, (customer) => customer.favouriteAd, {})
  @JoinColumn({ name: 'customerId' })
  customer: ECustomer;

  @ManyToOne(() => EAd, (ad) => ad.favouriteAd, {})
  @JoinColumn({ name: 'adId' })
  ad: EAd;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
