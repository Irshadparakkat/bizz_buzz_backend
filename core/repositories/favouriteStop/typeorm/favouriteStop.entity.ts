import { ECustomer } from 'core/repositories/customer/typeorm/customer.entity';
import { EStop } from 'core/repositories/stop/typeorm/stop.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'favouriteStop' })
export class EFavouriteStop {
  @PrimaryGeneratedColumn()
  favouriteStopId: number;

  @ManyToOne(() => ECustomer, (customer) => customer.favouriteStop, {})
  @JoinColumn({ name: 'customerId' })
  customer: ECustomer;

  @ManyToOne(() => EStop, (stop) => stop.favouriteStop, {})
  @JoinColumn({ name: 'stopId' })
  stop: EStop;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
