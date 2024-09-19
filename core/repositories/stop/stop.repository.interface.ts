import { IStop } from 'core/entities/stop/stop.interface';
import { EStop } from './typeorm/stop.entity';

export interface StopRepositoryInterface {
  add(stop: IStop): Promise<IStop>;

  find(stopId: number): Promise<IStop | undefined>;
  search(
    where?: Partial<IStop> | Partial<IStop>[],
    limit?: number,
    offset?: number,
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<IStop[]>;
  count(
    where?: Partial<IStop>,
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<number>;

  update(stopId: number, fields: Partial<IStop>): Promise<IStop | undefined>;

  delete(stopId: number): Promise<boolean>;

  toEntity(input: IStop): EStop;

  fromEntity(input: EStop): IStop;

  toPartialEntity(input: Partial<IStop>): Promise<Partial<EStop>>;
}
