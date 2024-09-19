import { IFavouriteAd } from "core/entities/favouriteAd/favouriteAd.interface";

export interface FavouriteAdRepositoryInterface {
  add(favouriteAd: IFavouriteAd): Promise<IFavouriteAd>;

  find(favouriteAdId: number): Promise<IFavouriteAd | undefined>;

  search(where?: Partial<IFavouriteAd>, limit?: number, offset?: number): Promise<IFavouriteAd[]>;

  count(where?: Partial<IFavouriteAd>): Promise<number>;

  delete(favouriteAdId: number): Promise<boolean>;

}