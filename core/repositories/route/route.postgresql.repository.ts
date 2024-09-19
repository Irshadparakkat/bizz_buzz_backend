import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IRoute } from 'core/entities/route/route.interface';
import { ERoute } from './typeorm/route.entity';
import { RouteRepositoryInterface } from './route.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import { IStop } from 'core/entities/stop/stop.interface';
import { ERouteStop } from './typeorm/stop.route.entity';
import { EStop } from '../stop/typeorm/stop.entity';
import { IRouteStop } from 'core/entities/route/stop.interface';

@Injectable()
export class RoutePostgreSQLRepository
  extends BasePostgreSQLRepository
  implements RouteRepositoryInterface
{
  async add(route: IRoute): Promise<IRoute> {
    await this.init();
    const repository = this.dataSource().getRepository(ERoute);
    const generatedEntity = await repository.save(this.toEntity(route));
    return this.fromEntity(generatedEntity);
  }

  public toEntity(input: IRoute): ERoute {
    const output = new ERoute();
    if (input.routeId) output.routeId = input.routeId;
    output.name = input.name;
    output.via = input.via;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  public fromEntity(input: ERoute): IRoute {
    const stops = input?.routeStop?.map((routeStop) => {
      return this.fromStopEntity(routeStop.stop, routeStop.order);
    });
    return {
      routeId: input.routeId,
      name: input.name,
      via: input.via,
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
      stop: stops,
    };
  }

  private fromStopEntity(stop: EStop, order: number): IRouteStop {
    return {
      stopId: stop.stopId,
      name: stop.name,
      location: stop.location,
      latitude: stop.latitude,
      longitude: stop.longitude,
      order: order,
    };
  }

  async find(routeId: number): Promise<IRoute | undefined> {
    const entity = await this.findEntity(routeId);
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  private async findEntity(routeId: number) {
    await this.init();
    const repository = this.dataSource().getRepository(ERoute);
    return await repository.findOne({
      relations: {
        routeStop: {
          stop: true,
        },
      },
      order: { routeStop: { order: 1 } },
      where: { routeId },
    });
  }

  async search(
    where: Partial<IRoute> = {},
    limit?: number,
    offset?: number,
  ): Promise<IRoute[]> {
    await this.init();
    const repository = this.dataSource().getRepository(ERoute);
    const userEntity = await repository.find({
      where: this.getWhere(where),
      relations: {
        routeStop: {
          stop: true,
        },
      },
      order: {
        routeId: 'ASC',
      },
      take: limit,
      skip: offset,
    });
    return userEntity.map((route) => this.fromEntity(route));
  }

  async count(where: Partial<IRoute> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(ERoute);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(route: Partial<IRoute> = {}) {
    const where: FindOptionsWhere<ERoute> = {};
    where.deletedTime = null;
    if (route.routeId) where.routeId = route.routeId;
    if (route.routeStop?.stop?.stopId)
      where.routeStop = {
        stop: {
          stopId: route.routeStop.stop.stopId,
        },
      };
    if (route.name) where.name = ILike(this.toWildcard(route.name));
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    routeId: number,
    fields: Partial<IRoute>,
  ): Promise<IRoute | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ERoute);
    await repository.save(await this.toPartialEntity(fields));
    return this.find(routeId);
  }

  async delete(routeId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(ERoute);
    await repository.softDelete({ routeId });
    return true;
  }

  public async toPartialEntity(
    input: Partial<IRoute>,
  ): Promise<Partial<ERoute>> {
    const output = input.routeId
      ? await this.findEntity(input.routeId)
      : new ERoute();
    output.name = input?.name ?? output.name;
    output.via = input?.via ?? output.via;
    if (input.routeStop) output.routeStop = [];
    return output;
  }

  public async addStop(
    route: IRoute,
    stop: IStop,
    order: number,
  ): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(ERouteStop);
    await repository.save({
      route: this.toEntity(route),
      stop: this.toStopEntity(stop),
      order: order,
    });
    return true;
  }

  public async removeStop(routeId: number, stopId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(ERouteStop);
    await repository.delete({ route: { routeId }, stop: { stopId } });
    return true;
  }

  public async clearStops(routeId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(ERouteStop);
    await repository.delete({ route: { routeId } });
    return true;
  }

  public toStopEntity(input: IStop): EStop {
    const output = new EStop();
    if (input.stopId) output.stopId = input.stopId;
    output.name = input.name;
    output.location = input.location;
    output.latitude = input.latitude;
    output.longitude = input.longitude;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }
}
