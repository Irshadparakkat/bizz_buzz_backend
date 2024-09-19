import { Inject, Injectable } from '@nestjs/common';
import { IBus } from 'core/entities/bus/bus.interface';
import { BusRepositoryInterface } from 'core/repositories/bus/bus.repository.interface';

@Injectable()
export class BusService {
  constructor(
    @Inject('BusRepository')
    private respository: BusRepositoryInterface,
  ) {}

  async createBus(body: IBus): Promise<IBus> {
    return await this.respository.add(body);
  }

  async showBus(busId: number): Promise<IBus | undefined> {
    return await this.respository.find(busId);
  }

  async listBus(
    where?: Partial<IBus>,
    limit?: number,
    offset?: number,
  ): Promise<IBus[]> {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IBus>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateBus(
    busId: number,
    body: Partial<IBus>,
  ): Promise<IBus | undefined> {
    return await this.respository.update(busId, body);
  }

  async deleteBus(busId: number): Promise<boolean> {
    return await this.respository.delete(busId);
  }
}
