import { ITrip } from 'core/entities/trip/trip.interface';
import { ETrip } from './typeorm/trip.entity';

export interface TripRepositoryInterface {
  add(trip: ITrip): Promise<ITrip>;

  find(tripId: number): Promise<ITrip | undefined>;

  search(
    where?: Partial<ITrip>,
    limit?: number,
    offset?: number,
  ): Promise<ITrip[]>;

  count(where?: Partial<ITrip>): Promise<number>;

  update(tripId: number, fields: Partial<ITrip>): Promise<ITrip | undefined>;

  delete(tripId: number): Promise<boolean>;

  toEntity(input: ITrip): ETrip;

  fromEntity(input: ETrip): ITrip;

  toPartialEntity(input: Partial<ITrip>): Promise<Partial<ETrip>>;
}
