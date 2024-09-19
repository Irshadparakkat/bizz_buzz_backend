import { Inject, Injectable } from '@nestjs/common';
import { IStop } from 'core/entities/stop/stop.interface';
import { StopRepositoryInterface } from 'core/repositories/stop/stop.repository.interface';

@Injectable()
export class StopService {
  constructor(
    @Inject('StopRepository')
    private respository: StopRepositoryInterface,
  ) {}

  async createStop(body: IStop): Promise<IStop> {
    return await this.respository.add(body);
  }

  async showStop(stopId: number): Promise<IStop | undefined> {
    return await this.respository.find(stopId);
  }

  async listStop(
    where?: Partial<IStop> | Partial<IStop>[],
    limit?: number,
    offset?: number,
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<IStop[]> {
    return await this.respository.search(where, limit, offset, currentLocation);
  }

  async count(
    where?: Partial<IStop>,
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<number> {
    return await this.respository.count(where, currentLocation);
  }

  async updateStop(
    stopId: number,
    body: Partial<IStop>,
  ): Promise<IStop | undefined> {
    return await this.respository.update(stopId, body);
  }

  async deleteStop(stopId: number): Promise<boolean> {
    return await this.respository.delete(stopId);
  }
}
