import { EAd } from 'core/repositories/ad/typeorm/ad.entity';
import { ECoupon } from 'core/repositories/coupon/typeorm/coupon.entity';
import { EInstantOffer } from 'core/repositories/instantOffer/typeorm/instantOffer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'business' })
export class EBusiness {
  @PrimaryGeneratedColumn()
  businessId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column({ default: 'active' })
  status: string;

  @Column()
  phoneNumber: string;

  @Column()
  businessType: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ nullable: true })
  gst: string;

  @Column()
  location: string;

  @Column('decimal')
  latitude: number;

  @Column('decimal')
  longitude: number;

  @OneToMany(() => EAd, (ad) => ad.business)
  ad?: EAd[];

  @OneToMany(() => ECoupon, (coupon) => coupon.customer)
  coupon?: ECoupon[];

  @OneToMany(() => EInstantOffer, (instantOffer) => instantOffer.business)
  instantOffer?: EInstantOffer[];

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  otp?: string;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime?: Date;
}
