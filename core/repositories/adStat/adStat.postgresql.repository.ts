import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { EAdStat } from './typeorm/adStat.entity';
import { AdStatRepositoryInterface } from './adStat.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import { CustomerRepositoryInterface } from '../customer/customer.repository.interface';
import { CustomerPostgreSQLRepository } from '../customer/customer.postgresql.repository';
import { IAdStat, IStats } from 'core/entities/adStat/adStat.interface';
import { AdRepositoryInterface } from '../ad/ad.repository.interface';
import { AdPostgreSQLRepository } from '../ad/ad.postgresql.repository';
import { ECustomer } from '../customer/typeorm/customer.entity';
import { EAd } from '../ad/typeorm/ad.entity';
import { IAd } from 'core/entities/ad/ad.interface';
import { EBusiness } from '../business/typeorm/business.entity';

@Injectable()
export class AdStatPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements AdStatRepositoryInterface
{
  private customerRepository: CustomerRepositoryInterface =
    new CustomerPostgreSQLRepository();
  private adRepository: AdRepositoryInterface = new AdPostgreSQLRepository();

  async add(adstat: IAdStat): Promise<IAdStat> {
    await this.init();
    const repository = this.dataSource().getRepository(EAdStat);
    const generatedEntity = await repository.save(this.toEntity(adstat));
    return this.fromEntity(generatedEntity);
  }

  async find(adStatId: number): Promise<IAdStat | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EAdStat);
    const entity = await repository.findOne({ where: { adStatId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IAdStat> | Partial<IAdStat>[] = {},
    limit?: number,
    offset?: number,
  ): Promise<IAdStat[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EAdStat);
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
    return entity.map((EAdStat) => this.fromEntity(EAdStat));
  }

  async count(where: Partial<IAdStat> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EAdStat);
    const entity = await repository.count({
      where: this.getWhere(where),
    });
    return entity;
  }

  private getWhere(input: Partial<IAdStat> | Partial<IAdStat>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<EAdStat> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }

  private getSingleWhere(adStat: Partial<IAdStat> = {}) {
    const where: FindOptionsWhere<EAdStat> = {};
    if (adStat.adStatId) where.adStatId = adStat.adStatId;
    if (adStat.customer?.customerId) {
      const customer: FindOptionsWhere<ECustomer> = {};
      customer.customerId = adStat.customer.customerId;
      where.customer = customer;
    }
    if (adStat.ad?.adId || adStat.business?.businessId) {
      const ad: FindOptionsWhere<EAd> = {};
      if (adStat.ad?.adId) ad.adId = adStat.ad.adId;
      if (adStat.business?.businessId) {
        const business: FindOptionsWhere<EBusiness> = {};
        business.businessId = adStat.business.businessId;
        ad.business = business;
      }
      where.ad = ad;
    }
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  private toEntity(input: IAdStat): EAdStat {
    const output = new EAdStat();
    output.adStatId = input.adStatId;
    output.customer = this.customerRepository.toEntity(input.customer);
    output.ad = this.adRepository.toEntity(input.ad as IAd);
    output.watched = input.watched;
    output.watchCount = input.watchCount;
    output.click = input.click;
    output.createdTime = input.createdTime;
    return output;
  }

  private fromEntity(input: EAdStat): IAdStat {
    return {
      adStatId: input.adStatId,
      customer: input.customer,
      ad: this.fromAdEntity(input.ad),
      watched: input.watched,
      watchCount: input.watchCount,
      click: input.click,
      createdTime: input.createdTime,
    };
  }

  private fromAdEntity(input: EAd): Partial<IAd> {
    return {
      adId: input.adId,
      name: input.name,
      adUrl: input.adUrl,
      thumbnailUrl: input.thumbnailUrl,
      sqrThumbnailUrl: input.sqrThumbnailUrl,
      status: input.status,
      category: input.category,
    };
  }

  async statsQuery(where?: Partial<IStats>) {
    await this.init();
    const repository = this.dataSource().getRepository(EAdStat);

    const qb = repository.createQueryBuilder('stats');
    qb.leftJoin('stats.customer', 'customer');
    qb.leftJoin('stats.ad', 'ad');
    qb.leftJoin('ad.business', 'business');
    const select = [];

    if (where.breakdown === 'customer') {
      select.push('customer.customerId AS customerId');
      qb.groupBy('customer.customerId');
    } else if (where.breakdown === 'ad') {
      select.push('ad.adId AS adId');
      qb.groupBy('ad.adId');
    } else if (where.breakdown === 'business') {
      select.push('business.businessId AS businessId');
      qb.groupBy('business.businessId');
    } else {
      select.push('stats.adStatId AS adStatId');
      qb.groupBy('stats.adStatId');
    }

    if (where.businessId) {
      qb.andWhere('business.businessId = :businessId', {
        businessId: where.businessId,
      });
    }

    if (where.adId) {
      qb.andWhere('ad.adId = :adId', {
        adId: where.adId,
      });
    }

    if (where.customerId) {
      qb.andWhere('customer.customerId = :customerId', {
        customerId: where.customerId,
      });
    }

    qb.select([
      ...select,
      'SUM(stats.watchCount) AS views',
      'COUNT(stats.customer) AS reach',
      'SUM(stats.click) AS click',
    ]);
    return qb;
  }

  async getStats(
    where?: Partial<IStats>,
    limit?: number,
    offset?: number,
  ): Promise<IStats[]> {
    const qb = await this.statsQuery(where);
    qb.take(limit).skip(offset);
    const entity = await qb.getRawMany();
    return entity.map((data) => data as IStats);
  }

  async countStats(where?: Partial<IStats>): Promise<number> {
    const qb = await this.statsQuery(where);
    return await qb.getCount();
  }
}
