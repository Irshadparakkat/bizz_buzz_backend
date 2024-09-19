import { ECustomer } from 'core/repositories/customer/typeorm/customer.entity';
import { EAd } from 'core/repositories/ad/typeorm/ad.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'adStat' })
export class EAdStat {
  @PrimaryGeneratedColumn()
  adStatId: number;

  @ManyToOne(() => ECustomer, (customer) => customer.adStat, {})
  @JoinColumn({ name: 'customerId' })
  customer: ECustomer;

  @ManyToOne(() => EAd, (ad) => ad.adStat, {})
  @JoinColumn({ name: 'adId' })
  ad: EAd;

  @Column()
  watched: number;

  @Column({ default: 0 })
  watchCount: number;

  @Column({ default: 0 })
  click: number;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
