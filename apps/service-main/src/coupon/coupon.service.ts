import { Inject, Injectable } from '@nestjs/common';
import { ICoupon } from 'core/entities/coupon/coupon.interface';
import { CouponRepositoryInterface } from 'core/repositories/coupon/coupon.repository.interface';

@Injectable()
export class CouponService {
  constructor(
    @Inject('CouponRepository')
    private repository: CouponRepositoryInterface,
  ) {}

  async addCoupon(body: ICoupon): Promise<ICoupon> {
    return await this.repository.add(body);
  }

  async showCoupon(couponId: number): Promise<ICoupon | undefined> {
    return await this.repository.find(couponId);
  }

  async listcoupon(
    where?: Partial<ICoupon> | Partial<ICoupon>[],
    limit?: number,
    offset?: number,
  ) {
    return await this.repository.search(where, limit, offset);
  }

  async count(where?: Partial<ICoupon> | Partial<ICoupon>[]): Promise<number> {
    return await this.repository.count(where);
  }
}
