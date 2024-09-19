import { EStop } from 'core/repositories/stop/typeorm/stop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ERoute } from './route.entity';

@Entity({ name: 'route_stop' })
export class ERouteStop {
  @PrimaryGeneratedColumn()
  routeStopId: number;

  @ManyToOne(() => EStop, (stop) => stop.routeStop)
  @JoinColumn({
    name: 'stopId',
  })
  stop: EStop;

  @ManyToOne(() => ERoute, (stop) => stop.routeStop)
  @JoinColumn({
    name: 'routeId',
  })
  route: ERoute;

  @Column()
  order: number;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
