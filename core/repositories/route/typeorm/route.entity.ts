import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ERouteStop } from './stop.route.entity';
import { ETrip } from 'core/repositories/trip/typeorm/trip.entity';

@Entity({ name: 'route' })
export class ERoute {
  @PrimaryGeneratedColumn()
  routeId: number;

  @Column()
  name: string;

  @Column()
  via: string;

  @OneToMany(() => ERouteStop, (routeStop) => routeStop.route, {
    cascade: true,
  })
  routeStop: ERouteStop[];

  @OneToMany(() => ETrip, (trip) => trip.route)
  trip: ETrip[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;
}
