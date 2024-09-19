import { EBusiness } from 'core/repositories/business/typeorm/business.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'instantOffer' })
export class EInstantOffer {
  @PrimaryGeneratedColumn()
  instantOfferId: number;

  @Column()
  message: string;

  @Column({ default: new Date() })
  validFrom: Date;

  @Column({ default: new Date() })
  validTo: Date;

  @Column()
  instantOfferRange: string;

  @Column()
  userCount: number;

  @Column()
  status: string;

  @ManyToOne(() => EBusiness, (business) => business.businessId, {})
  @JoinColumn({
    name: 'businessId',
  })
  business: EBusiness;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
