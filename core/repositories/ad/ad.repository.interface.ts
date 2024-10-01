import { IAd } from 'core/entities/ad/ad.interface';
import { EAd } from './typeorm/ad.entity';

export interface AdRepositoryInterface {
  add(ad: IAd): Promise<IAd>;

  find(adId: number): Promise<IAd | undefined>;

  update(adId: number, fields: Partial<IAd>): Promise<IAd | undefined>;

  search(
    where?: Partial<IAd> | Partial<IAd>[],
    limit?: number,
    offset?: number,
    latitude?: number,
    longitude?: number,
    busAd?:boolean
  ): Promise<IAd[]>;

  count(
    where?: Partial<IAd> | Partial<IAd>[],
    latitude?: number,
    longitude?: number,
  ): Promise<number>;

  delete(adId: number): Promise<boolean>;

  toEntity(input: IAd): EAd;

  fromEntity(input: EAd): IAd;
}
