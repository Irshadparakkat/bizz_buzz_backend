import { Inject, Injectable } from '@nestjs/common';
import { IRoute } from 'core/entities/route/route.interface';
import { IStop } from 'core/entities/stop/stop.interface';
import { RouteRepositoryInterface } from 'core/repositories/route/route.repository.interface';

@Injectable()
export class RouteService {
  constructor(
    @Inject('RouteRepository')
    private respository: RouteRepositoryInterface,
  ) {}

  async createRoute(body: IRoute): Promise<IRoute> {
    return await this.respository.add(body);
  }

  async showRoute(routeId: number): Promise<IRoute | undefined> {
    return await this.respository.find(routeId);
  }

  async listRoute(
    where?: Partial<IRoute>,
    limit?: number,
    offset?: number,
  ): Promise<IRoute[]> {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IRoute>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateRoute(
    routeId: number,
    body: Partial<IRoute>,
  ): Promise<IRoute | undefined> {
    return await this.respository.update(routeId, body);
  }

  async deleteRoute(routeId: number): Promise<boolean> {
    return await this.respository.delete(routeId);
  }

  async addStop(route: IRoute, stop: IStop, order: number) {
    return await this.respository.addStop(route, stop, order);
  }

  async removeStop(routeId: number, stopId: number): Promise<boolean> {
    return await this.respository.removeStop(routeId, stopId);
  }

  async clearStops(routeId: number): Promise<boolean> {
    return await this.respository.clearStops(routeId);
  }
}
