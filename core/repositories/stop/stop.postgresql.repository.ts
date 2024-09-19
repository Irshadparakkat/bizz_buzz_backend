import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IStop } from 'core/entities/stop/stop.interface';
import { EStop } from './typeorm/stop.entity';
import { StopRepositoryInterface } from './stop.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';

@Injectable()
export class StopPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements StopRepositoryInterface
{
  async add(stop: IStop): Promise<IStop> {
    await this.init();
    const repository = this.dataSource().getRepository(EStop);
    const generatedEntity = await repository.save(this.toEntity(stop));
    return this.fromEntity(generatedEntity);
  }

  public toEntity(input: IStop): EStop {
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

  public fromEntity(input: Partial<EStop>): IStop {
    return {
      stopId: input.stopId,
      name: input.name,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      distance: input?.distance,
      liked: input.liked > 0,
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }

  async find(stopId: number): Promise<IStop | undefined> {
    const entity = await this.findEntity(stopId);
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  private async findEntity(stopId: number) {
    await this.init();
    const repository = this.dataSource().getRepository(EStop);
    return await repository.findOne({
      where: { stopId },
      relations: [],
    });
  }

  async search(
    where: Partial<IStop> | Partial<IStop>[] = {},
    limit?: number,
    offset?: number,
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<IStop[]> {
    const queryBuilder = await this.getQuery(where, currentLocation);

    const stopEntity = await queryBuilder
      .offset(offset)
      .limit(limit)
      .getRawMany();
    return stopEntity.map((stop) =>
      this.fromEntity({
        stopId: stop?.stop_stopId,
        name: stop?.stop_name,
        location: stop?.stop_location,
        latitude: stop?.stop_latitude,
        longitude: stop?.stop_longitude,
        createdTime: stop?.stop_createdTime,
        updatedTime: stop?.stop_updatedTime,
        distance: stop.distance,
        liked: stop.liked,
      }),
    );
  }

  private async getQuery(
    where: Partial<IStop> | Partial<IStop>[] = {},
    currentLocation?: { latitude: number; longitude: number },
  ) {
    await this.init();
    const repository = this.dataSource().getRepository(EStop);
    const queryBuilder = repository.createQueryBuilder('stop');

    if (!Array.isArray(where) && where?.customerId) {
      queryBuilder.leftJoin(
        'stop.favouriteStop',
        'favouriteStop',
        `favouriteStop.customerId = ${where?.customerId}`,
      );
      queryBuilder.addSelect('COUNT(favouriteStop.customerId) AS liked');
    }

    if (currentLocation) {
      queryBuilder.addSelect(
        `(
            6371 * acos(
                cos(radians(${currentLocation.latitude})) * cos(radians(stop.latitude)) *
                cos(radians(stop.longitude) - radians(${currentLocation.longitude})) +
                sin(radians(${currentLocation.latitude})) * sin(radians(stop.latitude))
            )
        )`,
        'distance',
      );
    }
    queryBuilder.where(this.getWhere(where));
    queryBuilder.groupBy('stop.stopId');
    if (currentLocation) {
      queryBuilder.orderBy('distance', 'ASC');
    } else {
      queryBuilder.orderBy('stop.name', 'ASC');
    }

    return queryBuilder;
  }

  async count(
    where: Partial<IStop> | Partial<IStop>[] = {},
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<number> {
    await this.init();
    const queryBuilder = await this.getQuery(where, currentLocation);
    return queryBuilder.getCount();
  }

  private getWhere(input: Partial<IStop> | Partial<IStop>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<EStop> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }

  private getSingleWhere(input: Partial<IStop>) {
    const where: FindOptionsWhere<EStop> = {};
    if (input.latitude) where.latitude = input.latitude;
    if (input.longitude) where.longitude = input.longitude;
    if (input.location) where.location = ILike(this.toWildcard(input.location));
    if (input.name) where.name = ILike(this.toWildcard(input.name));
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    stopId: number,
    fields: Partial<IStop>,
  ): Promise<IStop | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EStop);
    await repository.save(await this.toPartialEntity(fields));
    return this.find(stopId);
  }

  async delete(stopId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EStop);
    await repository.softDelete({ stopId });
    return true;
  }

  public async toPartialEntity(input: Partial<IStop>): Promise<Partial<EStop>> {
    const output = input.stopId
      ? await this.findEntity(input.stopId)
      : new EStop();
    output.name = input?.name ?? output.name;
    output.location = input?.location ?? output.location;
    output.latitude = input?.latitude ?? output.latitude;
    output.longitude = input?.longitude ?? output.longitude;
    return output;
  }
}
