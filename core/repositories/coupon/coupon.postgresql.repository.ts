import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { FindOptionsWhere, ILike, LessThan, Not } from 'typeorm';
import { CustomerRepositoryInterface } from '../customer/customer.repository.interface';
import { CustomerPostgreSQLRepository } from '../customer/customer.postgresql.repository';
import { ECustomer } from '../customer/typeorm/customer.entity';
import { ICoupon } from 'core/entities/coupon/coupon.interface';
import { ECoupon } from './typeorm/coupon.entity';
import { CouponRepositoryInterface } from './coupon.repository.interface';
import { RandomStringGenerator } from 'shared/service/random.string.genrator.service';
import { EBusiness } from '../business/typeorm/business.entity';
import { BusinessRepositoryInterface } from '../business/business.repository.interface';
import { BusinessPostgreSQLRepository } from '../business/business.postgresql.repository';
import { IBusiness } from 'core/entities/business/business.interface';

@Injectable()
export class CouponPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements CouponRepositoryInterface
{
  private customerRepository: CustomerRepositoryInterface =
    new CustomerPostgreSQLRepository();
  private businessRepository: BusinessRepositoryInterface =
    new BusinessPostgreSQLRepository();

  async add(coupon: ICoupon): Promise<ICoupon> {
    await this.init();
    const repository = this.dataSource().getRepository(ECoupon);
    const generatedEntity = await repository.save(this.toEntity(coupon));
    return this.fromEntity(generatedEntity);
  }

  async find(couponId: number): Promise<ICoupon | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ECoupon);
    const entity = await repository.findOne({
      where: { couponId },
      relations: {
        customer: true,
        business: true,
      },
    });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<ICoupon> | Partial<ICoupon>[] = {},
    limit?: number,
    offset?: number,
  ): Promise<ICoupon[]> {
    await this.init();
    const repository = this.dataSource().getRepository(ECoupon);
    const entity = await repository.find({
      where: this.getWhere(where),
      relations: {
        customer: true,
        business: true,
      },
      order: { createdTime: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entity.map((coupon) => this.fromEntity(coupon));
  }

  async count(where: Partial<ICoupon> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(ECoupon);
    const entity = await repository.count({
      where: this.getWhere(where),
    });
    return entity;
  }

  private getWhere(input: Partial<ICoupon> | Partial<ICoupon>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<ECoupon> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }

  private getSingleWhere(coupon: Partial<ICoupon> = {}) {
    const where: FindOptionsWhere<ECoupon> = {};
    if (coupon.couponId) where.couponId = coupon.couponId;
    if (coupon.customer) {
      const customer: FindOptionsWhere<ECustomer> = {};
      if (coupon.customer.customerId)
        customer.customerId = coupon.customer.customerId;
      if (coupon.customer.name)
        customer.name = ILike(this.toWildcard(coupon.customer.name));
      where.customer = customer;
    }

    if (coupon.business) {
      const business: FindOptionsWhere<EBusiness> = {};
      if (coupon.business.businessId)
        business.businessId = coupon.business.businessId;
      if (coupon.business.name)
        business.name = ILike(this.toWildcard(coupon.business.name));
      where.business = business;
    }

    if (coupon.redemedStatus !== undefined)
      where.redemedStatus = coupon.redemedStatus;

    if (coupon.expired !== undefined) {
      const today = new Date();
      if (coupon.expired) {
        where.validity = LessThan(today);
      } else {
        where.validity = Not(LessThan(today));
      }
    }

    if (coupon.coupon) where.coupon = coupon.coupon;

    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  private toEntity(input: ICoupon): ECoupon {
    const output = new ECoupon();
    output.couponId = input.couponId;
    output.customer = this.customerRepository.toEntity(input.customer);
    output.amount = input.amount;
    output.point = input.point;
    output.coupon =
      input.coupon ??
      'B&B-' +
        new RandomStringGenerator().generateRandomString(5) +
        input.customer.customerId;
    output.validity = input.validity;
    output.redemedStatus = input.redemedStatus;
    output.redemedTime = input.redemedTime;
    if (input.business)
      output.business = this.businessRepository.toEntity(
        input.business as IBusiness,
      );

    output.createdTime = input.createdTime;
    return output;
  }

  private fromEntity(input: ECoupon): ICoupon {
    let status = '';

    if (input.redemedStatus) {
      status = 'Redeemed';
    } else {
      if (input.validity.getTime() < new Date().getTime()) {
        status = 'Expired';
      } else {
        status = 'Active';
      }
    }
    return {
      couponId: input.couponId,
      customer: input.customer,
      coupon: input.coupon,
      redemedStatus: input.redemedStatus,
      redemedTime: input.redemedTime,
      business:
        input.business && this.businessRepository.fromEntity(input.business),
      amount: input.amount,
      validity: input.validity,
      createdTime: input.createdTime,
      point: input.point,
      status,
    };
  }
}
