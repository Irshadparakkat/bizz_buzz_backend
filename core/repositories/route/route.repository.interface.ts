import { IRoute } from 'core/entities/route/route.interface';
import { ERoute } from './typeorm/route.entity';
import { IStop } from 'core/entities/stop/stop.interface';

export interface RouteRepositoryInterface {
  add(route: IRoute): Promise<IRoute>;

  find(routeId: number): Promise<IRoute | undefined>;
  search(
    where?: Partial<IRoute>,
    limit?: number,
    offset?: number,
  ): Promise<IRoute[]>;
  count(where?: Partial<IRoute>): Promise<number>;

  update(routeId: number, fields: Partial<IRoute>): Promise<IRoute | undefined>;

  delete(routeId: number): Promise<boolean>;

  addStop(route: IRoute, stops: IStop, order: number): Promise<boolean>;

  removeStop(routeId: number, stopId: number): Promise<boolean>;

  clearStops(routeId: number): Promise<boolean>;

  toEntity(input: IRoute): ERoute;

  fromEntity(input: ERoute): IRoute;

  toPartialEntity(input: Partial<IRoute>): Promise<Partial<ERoute>>;
}
