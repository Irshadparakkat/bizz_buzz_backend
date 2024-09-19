import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IJourney } from 'core/entities/journey/journey.interface';
import { EJourney } from './typeorm/journey.entity';
import { JourneyRepositoryInterface } from './journey.repository.interface';
import { FindOptionsWhere } from 'typeorm';
import { DriverRepositoryInterface } from '../driver/driver.repository.interface';
import { DriverPostgreSQLRepository } from '../driver/driver.postgresql.repository';
import { TripRepositoryInterface } from '../trip/trip.repository.interface';
import { TripPostgreSQLRepository } from '../trip/trip.postgresql.repository';
import { ITrip } from 'core/entities/trip/trip.interface';
import { ETrip } from '../trip/typeorm/trip.entity';

@Injectable()
export class JourneyPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements JourneyRepositoryInterface
{
  private driverRepository: DriverRepositoryInterface =
    new DriverPostgreSQLRepository();
  private tripRepository: TripRepositoryInterface =
    new TripPostgreSQLRepository();
  async add(journey: IJourney): Promise<IJourney> {
    await this.init();
    const repository = this.dataSource().getRepository(EJourney);
    const generatedEntity = await repository.save(this.toEntity(journey));
    return this.find(generatedEntity.journeyId);
  }

  private toEntity(input: IJourney): EJourney {
    const output = new EJourney();
    output.status = input.status;
    output.driver = this.driverRepository.toEntity(input.driver);
    output.trip = this.tripRepository.toEntity(input.trip as ITrip);
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  private fromEntity(input: EJourney): IJourney {
    return {
      journeyId: input.journeyId,
      status: input.status,
      driver: input.driver && this.driverRepository.fromEntity(input.driver),
      trip: this.tripRepository.fromEntity(input.trip),
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }

  async find(journeyId: number): Promise<IJourney | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EJourney);
    const entity = await repository.findOne({
      relations: {
        driver: true,
        trip: {
          bus: true,
          route: true,
        },
      },
      where: { journeyId },
    });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IJourney> = {},
    limit?: number,
    offset?: number,
  ): Promise<IJourney[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EJourney);
    const userEntity = await repository.find({
      relations: ['driver', 'trip'],
      where: this.getWhere(where),
      take: limit,
      skip: offset,
    });
    return userEntity.map((EJourney) => this.fromEntity(EJourney));
  }

  async count(where: Partial<IJourney> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EJourney);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(user: Partial<IJourney> = {}) {
    const where: FindOptionsWhere<EJourney> = {};
    where.deletedTime = null;
    if (user.journeyId) where.journeyId = user.journeyId;
    if (user.status) where.status = user.status;
    if (user.trip) {
      const whereTrip: FindOptionsWhere<ETrip> = {};
      if (user.trip.tripId) whereTrip.tripId = user.trip.tripId;
      where.trip = whereTrip;
    }
    return where;
  }

  async update(
    journeyId: number,
    fields: Partial<IJourney>,
  ): Promise<IJourney | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EJourney);
    await repository.update({ journeyId }, this.toPartialEntity(fields));
    return this.find(journeyId);
  }

  async delete(journeyId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EJourney);
    await repository.softDelete({ journeyId });
    return true;
  }

  private toPartialEntity(input: Partial<IJourney>): Partial<EJourney> {
    const output = new EJourney();
    output.status = input?.status;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }
}
