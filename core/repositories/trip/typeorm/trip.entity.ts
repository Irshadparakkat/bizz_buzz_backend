import { EBus } from 'core/repositories/bus/typeorm/bus.entity';
import { EJourney } from 'core/repositories/journey/typeorm/journey.entity';
import { ERoute } from 'core/repositories/route/typeorm/route.entity';
import { EStop } from 'core/repositories/stop/typeorm/stop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'trip' })
export class ETrip {
  @PrimaryGeneratedColumn()
  tripId: number;

  @Column()
  tripName: string;

  @ManyToOne(() => EBus, (bus) => bus.trip, { nullable: true })
  @JoinColumn({
    name: 'busId',
  })
  bus: EBus | null;

  @ManyToOne(() => ERoute, (route) => route.trip, { nullable: true })
  @JoinColumn({ name: 'routeId' })
  route: ERoute;

  @Column({ default: 'Active' })
  status: string;

  @OneToMany(() => EJourney, (journey) => journey.trip, {})
  journey: EJourney[];

  @OneToMany(() => ETripStopTime, (stopTime) => stopTime.trip, {
    cascade: true,
  })
  stopTime: ETripStopTime[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}

@Entity({ name: 'tripStopTime' })
export class ETripStopTime {
  @PrimaryGeneratedColumn()
  tripStopTimeId: number;

  @ManyToOne(() => EStop, (stop) => stop.tripStopTime)
  @JoinColumn({ name: 'stopId' })
  stop: EStop;

  @ManyToOne(() => ETrip, (trip) => trip.stopTime)
  @JoinColumn({ name: 'tripId' })
  trip: ETrip;

  @Column()
  hour: number;

  @Column()
  min: number;
}
