import { Inject, Injectable } from '@nestjs/common';
import { IFavouriteStop } from 'core/entities/favouriteStop/favouriteStop.interface';
import { FavouriteStopRepositoryInterface } from 'core/repositories/favouriteStop/favouriteStop.repository.interface';

@Injectable()
export class FavouriteStopService {
  constructor(
    @Inject('FavouriteStopRepository')
    private repository: FavouriteStopRepositoryInterface,
  ) { }

  async createFavouriteStop(body: IFavouriteStop): Promise<IFavouriteStop> {
    return await this.repository.add(body);
  }

  async listFavouriteStop(
    where?: Partial<IFavouriteStop>,
    limit?: number,
    offset?: number,
  ): Promise<IFavouriteStop[]> {
    return await this.repository.search(where, limit, offset);
  }

  async count(where?: Partial<IFavouriteStop>): Promise<number> {
    return await this.repository.count(where);
  }

  async deleteFavouriteStop(favouriteStopId: number): Promise<boolean> {
    return await this.repository.delete(favouriteStopId);
  }

}