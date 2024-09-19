import { EDriver } from 'core/repositories/driver/typeorm/driver.entity';
import { ETrip } from 'core/repositories/trip/typeorm/trip.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'bus' })
export class EBus {
  @PrimaryGeneratedColumn()
  busId: number;

  @Column()
  name: string;

  @Column()
  vehicleNumber: string;

  @Column()
  capacity: number;

  @Column({ default: 'active' })
  status: string;

  @ManyToMany(() => EDriver, (driver) => driver.bus)
  @JoinTable()
  driver: EDriver[];

  @OneToMany(() => ETrip, (trip) => trip.bus)
  trip: ETrip[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
