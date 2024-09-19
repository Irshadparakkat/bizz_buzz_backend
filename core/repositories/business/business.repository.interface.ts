import { IBusiness } from 'core/entities/business/business.interface';
import { EBusiness } from './typeorm/business.entity';

export interface BusinessRepositoryInterface {
  add(business: IBusiness): Promise<IBusiness>;

  find(businessId: number): Promise<IBusiness | undefined>;

  search(
    where?: Partial<IBusiness> | Partial<IBusiness>[],
    limit?: number,
    offset?: number,
  ): Promise<IBusiness[]>;

  count(where?: Partial<IBusiness>): Promise<number>;

  update(
    businessId: number,
    fields: Partial<IBusiness>,
  ): Promise<IBusiness | undefined>;

  verify(body: Partial<IBusiness>): Promise<{
    status: boolean;
    message: string | IBusiness;
  }>;

  delete(businessId: number): Promise<boolean>;

  toEntity(input: IBusiness): EBusiness;

  fromEntity(input: EBusiness): IBusiness;
}
