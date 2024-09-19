import { IFavouriteStop } from "core/entities/favouriteStop/favouriteStop.interface";

export interface FavouriteStopRepositoryInterface {
  add(favouriteStop: IFavouriteStop): Promise<IFavouriteStop>;

  find(favouriteStopId: number): Promise<IFavouriteStop | undefined>;

  search(where?: Partial<IFavouriteStop>, limit?: number, offset?: number): Promise<IFavouriteStop[]>;

  count(where?: Partial<IFavouriteStop>): Promise<number>;

  delete(favouriteStopId: number): Promise<boolean>;

}