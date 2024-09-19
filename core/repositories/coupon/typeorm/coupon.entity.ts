import { EBusiness } from 'core/repositories/business/typeorm/business.entity';
import { ECustomer } from 'core/repositories/customer/typeorm/customer.entity';
import { RandomStringGenerator } from 'shared/service/random.string.genrator.service';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'coupon' })
export class ECoupon {
  @PrimaryGeneratedColumn()
  couponId: number;

  @ManyToOne(() => ECustomer, (customer) => customer.coupon, {})
  @JoinColumn({ name: 'customerId' })
  customer: ECustomer;

  @ManyToOne(() => EBusiness, (business) => business.coupon, { nullable: true })
  @JoinColumn({ name: 'businessId' })
  business?: EBusiness;

  @Column({ nullable: true, default: null })
  redemedTime?: Date;

  @Column({ default: false })
  redemedStatus: boolean;

  @Column()
  amount: number;

  @Column()
  coupon: string;

  @Column({ default: 0 })
  point: number;

  @Column({ default: new Date().toISOString() })
  validity: Date;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
