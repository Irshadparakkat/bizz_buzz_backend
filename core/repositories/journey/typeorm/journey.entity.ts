import { EDriver } from 'core/repositories/driver/typeorm/driver.entity';
import { ETrip } from 'core/repositories/trip/typeorm/trip.entity';
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

@Entity({ name: 'journey' })
export class EJourney {
  @PrimaryGeneratedColumn()
  journeyId: number;

  @ManyToOne(() => EDriver, (driver) => driver.journey, {})
  @JoinColumn({
    name: 'driverId',
  })
  driver: EDriver;

  @ManyToOne(() => ETrip, (trip) => trip.journey, {})
  @JoinColumn({
    name: 'tripId',
  })
  trip: ETrip;

  @Column()
  status: string;

  @UpdateDateColumn()
  createdTime: Date;

  @CreateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
