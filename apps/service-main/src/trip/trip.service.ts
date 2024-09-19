import { Inject, Injectable } from '@nestjs/common';
import { ITrip } from 'core/entities/trip/trip.interface';
import { TripRepositoryInterface } from 'core/repositories/trip/trip.repository.interface';

@Injectable()
export class TripService {
  constructor(
    @Inject('TripRepository')
    private respository: TripRepositoryInterface,
  ) {}

  async createTrip(body: ITrip): Promise<ITrip> {
    return await this.respository.add(body);
  }

  async showTrip(tripId: number): Promise<ITrip | undefined> {
    return await this.respository.find(tripId);
  }

  async listTrip(
    where?: Partial<ITrip>,
    limit?: number,
    offset?: number,
  ): Promise<ITrip[]> {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<ITrip>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateTrip(
    tripId: number,
    body: Partial<ITrip>,
  ): Promise<ITrip | undefined> {
    return await this.respository.update(tripId, body);
  }

  async deleteTrip(tripId: number): Promise<boolean> {
    return await this.respository.delete(tripId);
  }
}
