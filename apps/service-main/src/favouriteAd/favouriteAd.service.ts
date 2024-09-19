import { Inject, Injectable } from '@nestjs/common';
import { IFavouriteAd } from 'core/entities/favouriteAd/favouriteAd.interface';
import { FavouriteAdRepositoryInterface } from 'core/repositories/favouriteAd/favouriteAd.repository.interface';

@Injectable()
export class FavouriteAdService {
  constructor(
    @Inject('FavouriteAdRepository')
    private repository: FavouriteAdRepositoryInterface,
  ) { }

  async createFavouriteAd(body: IFavouriteAd): Promise<IFavouriteAd> {
    return await this.repository.add(body);
  }

  async listFavouriteAd(
    where?: Partial<IFavouriteAd>,
    limit?: number,
    offset?: number,
  ): Promise<IFavouriteAd[]> {
    return await this.repository.search(where, limit, offset);
  }

  async count(where?: Partial<IFavouriteAd>): Promise<number> {
    return await this.repository.count(where);
  }

  async deleteFavouriteAd(favouriteAdId: number): Promise<boolean> {
    return await this.repository.delete(favouriteAdId);
  }

}