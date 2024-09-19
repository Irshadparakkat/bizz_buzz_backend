import { EFavouriteStop } from 'core/repositories/favouriteStop/typeorm/favouriteStop.entity';
import { ERouteStop } from 'core/repositories/route/typeorm/stop.route.entity';
import { ETripStopTime } from 'core/repositories/trip/typeorm/trip.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'stop' })
export class EStop {
  @PrimaryGeneratedColumn()
  stopId: number;

  @OneToMany(() => ERouteStop, (route) => route.stop, { cascade: true })
  routeStop: ERouteStop[];

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    type: 'float',
  })
  latitude: number;

  @Column({
    type: 'float',
  })
  longitude: number;

  @OneToMany(() => ETripStopTime, (tripStop) => tripStop.stop, {
    cascade: true,
  })
  tripStopTime: ETripStopTime[];

  distance?: number;

  @OneToMany(() => EFavouriteStop, (favouriteStop) => favouriteStop.stop)
  favouriteStop: EFavouriteStop[];

  @UpdateDateColumn()
  createdTime: Date;

  @CreateDateColumn()
  updatedTime: Date;

  @DeleteDateColumn()
  deletedTime: Date;

  liked?: number;
}
