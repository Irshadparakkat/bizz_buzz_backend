import { ICoupon } from 'core/entities/coupon/coupon.interface';

export interface CouponRepositoryInterface {
  add(ad: ICoupon): Promise<ICoupon>;

  find(adId: number): Promise<ICoupon | undefined>;

  search(
    where?: Partial<ICoupon> | Partial<ICoupon>[],
    limit?: number,
    offset?: number,
  ): Promise<ICoupon[]>;

  count(where?: Partial<ICoupon> | Partial<ICoupon>[]): Promise<number>;
}
