import { EAdStat } from 'core/repositories/adStat/typeorm/adStat.entity';
import { EFavouriteAd } from 'core/repositories/favouriteAd/typeorm/favouriteAd.entity';
import { ECoupon } from 'core/repositories/coupon/typeorm/coupon.entity';
import { EFavouriteStop } from 'core/repositories/favouriteStop/typeorm/favouriteStop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'customer' })
export class ECustomer {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  loginToken: string;

  @Column({ default: 'active' })
  status: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  bloodGroup: string;

  @Column({ default: 'unwilling' })
  donationStatus: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: 0 })
  milestone: number;

  @OneToMany(() => EAdStat, (adStat) => adStat.customer)
  adStat: EAdStat[];

  @OneToMany(() => ECoupon, (coupon) => coupon.customer)
  coupon: ECoupon[];

  @OneToMany(() => EFavouriteStop, (favouriteStop) => favouriteStop.customer)
  favouriteStop: EFavouriteStop[];

  @OneToMany(() => EFavouriteAd, (favouriteAd) => favouriteAd.ad)
  favouriteAd: EFavouriteAd[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
