import { IBus } from 'core/entities/bus/bus.interface';
import { EBus } from './typeorm/bus.entity';

export interface BusRepositoryInterface {
  add(bus: IBus): Promise<IBus>;

  find(busId: number): Promise<IBus | undefined>;

  search(
    where?: Partial<IBus>,
    limit?: number,
    offset?: number,
  ): Promise<IBus[]>;
  count(where?: Partial<IBus>): Promise<number>;

  update(busId: number, fields: Partial<IBus>): Promise<IBus | undefined>;

  delete(busId: number): Promise<boolean>;

  toEntity(input: IBus): EBus;

  fromEntity(input: EBus): IBus;

  toPartialEntity(input: Partial<IBus>): Promise<Partial<EBus>>;
}
