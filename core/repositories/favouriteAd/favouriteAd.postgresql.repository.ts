import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { EFavouriteAd } from './typeorm/favouriteAd.entity';
import { FavouriteAdRepositoryInterface } from './favouriteAd.repository.interface';
import { CustomerRepositoryInterface } from '../customer/customer.repository.interface';
import { CustomerPostgreSQLRepository } from '../customer/customer.postgresql.repository';
import { IFavouriteAd } from 'core/entities/favouriteAd/favouriteAd.interface';
import { AdRepositoryInterface } from '../ad/ad.repository.interface';
import { AdPostgreSQLRepository } from '../ad/ad.postgresql.repository';
import { FindOptionsWhere, ILike } from 'typeorm';
import { EAd } from '../ad/typeorm/ad.entity';
import { ECustomer } from '../customer/typeorm/customer.entity';
import { IAd } from 'core/entities/ad/ad.interface';
import { ICustomer } from 'core/entities/customer/customer.interface';

@Injectable()
export class FavouriteAdPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements FavouriteAdRepositoryInterface
{
  private customerRepository: CustomerRepositoryInterface =
    new CustomerPostgreSQLRepository();
  private adRepository: AdRepositoryInterface = new AdPostgreSQLRepository();

  async add(favouriteAd: IFavouriteAd): Promise<IFavouriteAd> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteAd);
    const generatedEntity = await repository.save(this.toEntity(favouriteAd));
    return this.fromEntity(generatedEntity);
  }

  async find(favouriteAdId: number): Promise<IFavouriteAd | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteAd);
    const entity = await repository.findOne({ where: { favouriteAdId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IFavouriteAd> = {},
    limit?: number,
    offset?: number,
  ): Promise<IFavouriteAd[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteAd);
    const entity = await repository.find({
      where: this.getWhere(where),
      relations: {
        customer: true,
        ad: {
          business: true,
        },
      },
      take: limit,
      skip: offset,
    });
    return entity.map((favouriteAd) => this.fromEntity(favouriteAd));
  }

  async count(where: Partial<IFavouriteAd> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteAd);
    const entity = await repository.count({
      where: this.getWhere(where),
    });
    return entity;
  }

  private getWhere(favouriteAd: Partial<IFavouriteAd> = {}) {
    const where: FindOptionsWhere<EFavouriteAd> = {};
    if (favouriteAd.favouriteAdId)
      where.favouriteAdId = favouriteAd.favouriteAdId;
    if (favouriteAd.customer) {
      const customer: FindOptionsWhere<ECustomer> = {};
      if (favouriteAd.customer.customerId)
        customer.customerId = favouriteAd.customer.customerId;
      if (favouriteAd.customer.name)
        customer.name = ILike(this.toWildcard(favouriteAd.customer.name));
      where.customer = customer;
    }
    if (favouriteAd.ad) {
      const ad: FindOptionsWhere<EAd> = {};
      if (favouriteAd.ad.adId) ad.adId = favouriteAd.ad.adId;
      if (favouriteAd.ad.name)
        ad.name = ILike(this.toWildcard(favouriteAd.ad.name));
      where.ad = ad;
    }
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async delete(favouriteAdId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EFavouriteAd);
    await repository.softDelete({ favouriteAdId });
    return true;
  }

  private toEntity(input: IFavouriteAd): EFavouriteAd {
    const output = new EFavouriteAd();
    output.favouriteAdId = input.favouriteAdId;
    output.customer = this.customerRepository.toEntity(
      input.customer as ICustomer,
    );
    output.ad = this.adRepository.toEntity(input.ad as IAd);
    output.createdTime = input.createdTime;
    return output;
  }

  private fromEntity(input: EFavouriteAd): IFavouriteAd {
    return {
      favouriteAdId: input.favouriteAdId,
      customer: this.customerRepository.fromEntity(input.customer),
      ad: this.adRepository.fromEntity({
        ...input.ad,
        liked: true,
      }),
      createdTime: input.createdTime,
    };
  }
}
