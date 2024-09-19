import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { ITrip } from 'core/entities/trip/trip.interface';
import { ETrip, ETripStopTime } from './typeorm/trip.entity';
import { TripRepositoryInterface } from './trip.repository.interface';
import { IStop, IStopTime } from 'core/entities/stop/stop.interface';
import { EStop } from '../stop/typeorm/stop.entity';
import { IRoute } from 'core/entities/route/route.interface';
import { ERoute } from '../route/typeorm/route.entity';
import { IBus } from 'core/entities/bus/bus.interface';
import { EBus } from '../bus/typeorm/bus.entity';
import { EJourney } from '../journey/typeorm/journey.entity';
import { IJourney } from 'core/entities/journey/journey.interface';

@Injectable()
export class TripPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements TripRepositoryInterface
{
  async add(trip: ITrip): Promise<ITrip> {
    await this.init();
    const repository = this.dataSource().getRepository(ETrip);
    const generatedEntity = await repository.save(this.toEntity(trip));
    return this.fromEntity(generatedEntity);
  }

  async find(tripId: number): Promise<ITrip | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ETrip);
    const entity = await repository.findOne({
      where: { tripId },
      relations: {
        bus: true,
        route: true,
        stopTime: {
          stop: true,
        },
        journey: {
          driver: true,
        },
      },
    });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<ITrip> = {},
    limit?: number,
    offset?: number,
  ): Promise<ITrip[]> {
    const queryBuilder = await this.getQuery(where);
    const entity = await queryBuilder.take(limit).skip(offset).getMany();
    return entity.map((ETrip) => this.fromEntity(ETrip));
  }

  async count(where: Partial<ITrip> = {}): Promise<number> {
    const queryBuilder = await this.getQuery(where);
    const entity = await queryBuilder.getCount();
    return entity;
  }

  private async getQuery(where: Partial<ITrip> = {}) {
    await this.init();
    const repository = this.dataSource().getRepository(ETrip);
    const queryBuilder = repository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.route', 'route')
      .leftJoinAndSelect('trip.stopTime', 'stopTime')
      .leftJoinAndSelect('stopTime.stop', 'stop')
      .leftJoinAndSelect('trip.journey', 'journey')
      .leftJoinAndSelect('journey.driver', 'driver')
      .where('trip.deletedTime IS NULL');

    if (where.tripName) {
      queryBuilder.andWhere('trip.tripName ILIKE :tripName', {
        tripName: this.toWildcard(where.tripName),
      });
    }

    if (where.commenName) {
      queryBuilder.andWhere(
        'trip.tripName ILIKE :name OR bus.name ILIKE :name OR route.name ILIKE :name',
        { name: this.toWildcard(where.commenName) },
      );
    }

    if (where.bus && where.bus.busId) {
      queryBuilder.andWhere('bus.busId = :busId', { busId: where.bus.busId });
    }

    if (where.bus && where.bus.name) {
      queryBuilder.andWhere('bus.name ILIKE :busName', {
        busName: this.toWildcard(where.bus.name),
      });
    }

    if (where.route && where.route.name) {
      queryBuilder.andWhere('route.name ILIKE :routeName', {
        routeName: this.toWildcard(where.route.name),
      });
    }

    if (where.route && where.route.routeId) {
      queryBuilder.andWhere('route.routeId = :routeId', {
        routeId: where.route.routeId,
      });
    }

    if (where.from && where.to) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMin = currentTime.getMinutes();
      const stopTimeRepository = this.dataSource().getRepository(ETripStopTime);
      const subQuery = stopTimeRepository
        .createQueryBuilder('fromStopTime')
        .select('fromStopTime.tripId')
        .innerJoin('fromStopTime.stop', 'fromStop')
        .innerJoin('fromStopTime.trip', 'fromTrip')
        .innerJoin('fromTrip.stopTime', 'toStopTime')
        .innerJoin('toStopTime.stop', 'toStop')
        .where('fromStop.stopId = :from', { from: where.from })
        .andWhere('toStop.stopId = :to', { to: where.to })
        .andWhere(
          '(fromStopTime.hour > :currentHour OR (fromStopTime.hour = :currentHour AND fromStopTime.min > :currentMin))',
          {
            currentHour,
            currentMin,
          },
        )
        .andWhere(
          'fromStopTime.hour * 60 + fromStopTime.min < toStopTime.hour * 60 + toStopTime.min',
        );

      queryBuilder.andWhere(
        `trip.tripId IN (${subQuery.getQuery()})`,
        subQuery.getParameters(),
      );
    }
    return queryBuilder;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    tripId: number,
    fields: Partial<ITrip>,
  ): Promise<ITrip | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ETrip);
    await repository.save(await this.toPartialEntity({ ...fields, tripId }));
    return this.find(tripId);
  }

  async delete(tripId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(ETrip);
    await repository.softDelete({ tripId });
    return true;
  }

  public toEntity(input: ITrip): ETrip {
    const output = new ETrip();
    if (input.tripId) output.tripId = input.tripId;
    output.tripName = input.tripName;
    output.status = input.status;
    output.stopTime = input.stopTime.map((stopWithTime) =>
      this.toStopTimeEntity(stopWithTime),
    );
    output.route = this.toRouteEntity(input.route as IRoute);
    output.bus = this.toBusEntity(input.bus);
    return output;
  }

  private toStopTimeEntity(stopWithTime: IStopTime): ETripStopTime {
    const output = new ETripStopTime();
    output.hour = stopWithTime.hour;
    output.min = stopWithTime.min;
    output.stop = this.toStopEntity(stopWithTime.stop);
    return output;
  }

  private toStopEntity(stop: IStop): EStop {
    const output = new EStop();
    output.stopId = stop.stopId;
    output.name = stop.name;
    output.latitude = stop.latitude;
    output.longitude = stop.longitude;
    output.location = stop.location;
    return output;
  }

  private toRouteEntity(input: IRoute): ERoute {
    const output = new ERoute();
    output.routeId = input.routeId;
    output.name = input.name;
    output.via = input.via;
    return output;
  }

  private toBusEntity(input: Partial<IBus>): EBus {
    const output = new EBus();
    output.busId = input.busId;
    output.capacity = input.capacity;
    output.name = input.name;
    return output;
  }

  public fromEntity(input: ETrip): ITrip {
    const today = new Date();
    return {
      tripId: input.tripId,
      tripName: input.tripName,
      status: input.status,
      bus: input.bus ? this.fromBusEntity(input.bus) : {},
      route: input.route ? this.fromRouteEntity(input.route) : {},
      stopTime: input.stopTime?.map((time) => this.fromStopTimeEntity(time)),
      journey: input.journey
        ? input.journey
            .filter(
              (journey) =>
                journey.updatedTime.getDate() == today.getDate() &&
                journey.updatedTime.getMonth() == today.getMonth() &&
                journey.updatedTime.getFullYear() == today.getFullYear(),
            )
            .map((journey) => this.fromJourneyEntity(journey))
        : [],
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }

  private fromJourneyEntity(input: EJourney): Partial<IJourney> {
    return {
      journeyId: input.journeyId,
      status: input.status,
      updatedTime: input.updatedTime,
      createdTime: input.createdTime,
      driver: { ...input.driver },
    };
  }

  private fromStopTimeEntity(input: ETripStopTime): IStopTime {
    return {
      hour: input.hour,
      min: input.min,
      stop: this.fromStopEntity(input.stop),
    };
  }

  private fromStopEntity(input: EStop): IStop {
    return {
      stopId: input.stopId,
      latitude: input.latitude,
      longitude: input.longitude,
      location: input.location,
      name: input.name,
    };
  }

  private fromRouteEntity(input: ERoute): IRoute {
    return {
      routeId: input.routeId,
      name: input.name,
      via: input.via,
    };
  }

  private fromBusEntity(input: EBus): Partial<IBus> {
    return {
      busId: input.busId,
      name: input.name,
      status: input.status,
      capacity: input.capacity,
      vehicleNumber: input.vehicleNumber,
    };
  }

  private async findEntity(tripId: number) {
    await this.init();
    const repository = this.dataSource().getRepository(ETrip);
    return await repository.findOne({
      relations: {},
      where: { tripId },
    });
  }

  public async toPartialEntity(input: Partial<ITrip>): Promise<Partial<ETrip>> {
    const output = input.tripId
      ? await this.findEntity(input.tripId)
      : new ETrip();
    if (input.tripName) output.tripName = input.tripName;
    if (input.status) output.status = input.status;
    if (input.bus) output.bus = this.toBusEntity(input.bus);
    if (input.route) output.route = this.toRouteEntity(input.route as IRoute);
    if (input.stopTime)
      output.stopTime = input.stopTime.map((time) =>
        this.toStopTimeEntity(time),
      );
    return output;
  }
}
