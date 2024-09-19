import {
  IDriver,
  IDriverTripTiming,
} from 'core/entities/driver/driver.interface';
import { EDriver } from './typeorm/driver.entity';

export interface DriverRepositoryInterface {
  add(driver: IDriver): Promise<IDriver>;

  find(driverId: number): Promise<IDriver | undefined>;
  search(
    where?: Partial<IDriver> | Partial<IDriver>[],
    limit?: number,
    offset?: number,
  ): Promise<IDriver[]>;

  verify(body: Partial<IDriver>): Promise<{
    status: boolean;
    message: string | IDriver;
  }>;

  count(where?: Partial<IDriver>): Promise<number>;

  update(
    driverId: number,
    fields: Partial<IDriver>,
  ): Promise<IDriver | undefined>;

  delete(driverId: number): Promise<boolean>;

  tripTiming(driverId: number): Promise<IDriverTripTiming[]>;

  toEntity(input: IDriver): EDriver;

  fromEntity(input: EDriver): IDriver;

  toPartialEntity(input: Partial<IDriver>): Promise<Partial<EDriver>>;
}
