import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { EFavouriteStop } from './typeorm/favouriteStop.entity';
import { FavouriteStopRepositoryInterface } from './favouriteStop.repository.interface';
import { CustomerRepositoryInterface } from '../customer/customer.repository.interface';
import { CustomerPostgreSQLRepository } from '../customer/customer.postgresql.repository';
import { IFavouriteStop } from 'core/entities/favouriteStop/favouriteStop.interface';
import { StopRepositoryInterface } from '../stop/stop.repository.interface';
import { StopPostgreSQLRepository } from '../stop/stop.postgresql.repository';
import { FindOptionsWhere, ILike } from 'typeorm';
import { EStop } from '../stop/typeorm/stop.entity';
import { ECustomer } from '../customer/typeorm/customer.entity';
import { IStop } from 'core/entities/stop/stop.interface';
import { ICustomer } from 'core/entities/customer/customer.interface';

@Injectable()
export class FavouriteStopPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements FavouriteStopRepositoryInterface
{
  private customerRepository: CustomerRepositoryInterface =
    new CustomerPostgreSQLRepository();
  private stopRepository: StopRepositoryInterface =
    new StopPostgreSQLRepository();

  async add(favouriteStop: IFavouriteStop): Promise<IFavouriteStop> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteStop);
    const generatedEntity = await repository.save(this.toEntity(favouriteStop));
    return this.fromEntity(generatedEntity);
  }

  async find(favouriteStopId: number): Promise<IFavouriteStop | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteStop);
    const entity = await repository.findOne({ where: { favouriteStopId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IFavouriteStop> = {},
    limit?: number,
    offset?: number,
  ): Promise<IFavouriteStop[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteStop);
    const entity = await repository.find({
      where: this.getWhere(where),
      relations: ['customer', 'stop'],
      take: limit,
      skip: offset,
    });
    return entity.map((favouriteStop) => this.fromEntity(favouriteStop));
  }

  async count(where: Partial<IFavouriteStop> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteStop);
    const entity = await repository.count({
      where: this.getWhere(where),
    });
    return entity;
  }

  private getWhere(favouriteStop: Partial<IFavouriteStop> = {}) {
    const where: FindOptionsWhere<EFavouriteStop> = {};
    if (favouriteStop.favouriteStopId)
      where.favouriteStopId = favouriteStop.favouriteStopId;
    if (favouriteStop.customer) {
      const customer: FindOptionsWhere<ECustomer> = {};
      if (favouriteStop.customer.customerId)
        customer.customerId = favouriteStop.customer.customerId;
      if (favouriteStop.customer.name)
        customer.name = ILike(this.toWildcard(favouriteStop.customer.name));
      where.customer = customer;
    }
    if (favouriteStop.stop) {
      const stop: FindOptionsWhere<EStop> = {};
      if (favouriteStop.stop.stopId) stop.stopId = favouriteStop.stop.stopId;
      if (favouriteStop.stop.name)
        stop.name = ILike(this.toWildcard(favouriteStop.stop.name));
      where.stop = stop;
    }
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async delete(favouriteStopId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteStop);
    await repository.softDelete({ favouriteStopId });
    return true;
  }

  private toEntity(input: IFavouriteStop): EFavouriteStop {
    const output = new EFavouriteStop();
    output.favouriteStopId = input.favouriteStopId;
    output.customer = this.customerRepository.toEntity(
      input.customer as ICustomer,
    );
    output.stop = this.stopRepository.toEntity(input.stop as IStop);
    output.createdTime = input.createdTime;
    return output;
  }

  private fromEntity(input: EFavouriteStop): IFavouriteStop {
    return {
      favouriteStopId: input.favouriteStopId,
      customer: this.customerRepository.fromEntity(input.customer),
      stop: this.stopRepository.fromEntity({
        ...input.stop,
        liked: 1,
      }),
      createdTime: input.createdTime,
    };
  }
}
