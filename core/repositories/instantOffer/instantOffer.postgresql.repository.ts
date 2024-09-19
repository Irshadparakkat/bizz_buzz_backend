import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IInstantOffer } from 'core/entities/instantOffer/instantOffer.interface';
import { EInstantOffer } from './typeorm/instantOffer.entity';
import { InstantOfferRepositoryInterface } from './instantOffer.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import { BusinessPostgreSQLRepository } from '../business/business.postgresql.repository';
import { BusinessRepositoryInterface } from '../business/business.repository.interface';
import { EBusiness } from '../business/typeorm/business.entity';

@Injectable()
export class InstantOfferPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements InstantOfferRepositoryInterface {
  private businessRepository: BusinessRepositoryInterface =
    new BusinessPostgreSQLRepository();

  async add(instantOffer: IInstantOffer): Promise<IInstantOffer> {
    await this.init();
    const repository = this.dataSource().getRepository(EInstantOffer);
    const generatedEntity = await repository.save(this.toEntity(instantOffer));
    return this.fromEntity(generatedEntity);
  }

  async find(instantOfferId: number): Promise<IInstantOffer | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EInstantOffer);
    const entity = await repository.findOne({ where: { instantOfferId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IInstantOffer> = {},
    limit?: number,
    offset?: number,
  ): Promise<IInstantOffer[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EInstantOffer);
    const entity = await repository.find({
      where: this.getWhere(where),
      relations: ['business'],
      take: limit,
      skip: offset,
    });
    return entity.map((EInstantOffer) => this.fromEntity(EInstantOffer));
  }

  async count(where: Partial<IInstantOffer> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EInstantOffer);
    const entity = await repository.count({
      where: this.getWhere(where),
    });
    return entity;
  }

  private getWhere(instantOffer: Partial<IInstantOffer> = {}) {
    const where: FindOptionsWhere<EInstantOffer> = {};
    if (instantOffer.instantOfferId) where.instantOfferId = instantOffer.instantOfferId;
    if (instantOffer.message) where.message = ILike(this.toWildcard(instantOffer.message));
    if (instantOffer.business) {
      const business: FindOptionsWhere<EBusiness> = {};
      if (instantOffer.business.businessId) business.businessId = instantOffer.business.businessId;
      if (instantOffer.business.name) business.name = ILike(this.toWildcard(instantOffer.business.name));
      where.business = business;
    }
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    instantOfferId: number,
    fields: Partial<IInstantOffer>,
  ): Promise<IInstantOffer | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EInstantOffer);
    await repository.update({ instantOfferId }, this.toPartialEntity(fields));
    return this.find(instantOfferId);
  }

  async delete(instantOfferId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EInstantOffer);
    await repository.softDelete({ instantOfferId });
    return true;
  }

  private toEntity(input: IInstantOffer): EInstantOffer {
    const output = new EInstantOffer();
    output.message = input.message;
    output.validFrom = input.validFrom;
    output.validTo = input.validTo;
    output.userCount = input.userCount;
    output.status = input.status;
    output.instantOfferRange = input.instantOfferRange;
    output.business = input.business && this.businessRepository.toEntity(input.business);
    output.createdTime = input.createdTime;
    return output;
  }

  private toPartialEntity(
    input: Partial<IInstantOffer>,
  ): Partial<EInstantOffer> {
    const output = new EInstantOffer();
    output.instantOfferId = input?.instantOfferId;
    output.message = input?.message;
    output.validFrom = input?.validFrom;
    output.validTo = input?.validTo;
    output.status = input.status;
    output.instantOfferRange = input?.instantOfferRange;
    output.userCount = input?.userCount;
    output.createdTime = input?.createdTime;
    return output;
  }

  private fromEntity(input: EInstantOffer): IInstantOffer {
    return {
      instantOfferId: input.instantOfferId,
      message: input.message,
      validFrom: input.validFrom,
      validTo: input.validTo,
      userCount: input.userCount,
      status: input.status,
      instantOfferRange: input.instantOfferRange,
      business: input.business && this.businessRepository.fromEntity(input.business),
      createdTime: input.createdTime,
    };
  }
}
