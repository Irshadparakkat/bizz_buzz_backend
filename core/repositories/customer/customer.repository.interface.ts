import { ICustomer } from 'core/entities/customer/customer.interface';
import { ECustomer } from './typeorm/customer.entity';

export interface CustomerRepositoryInterface {
  add(customer: ICustomer): Promise<ICustomer>;

  find(
    customerId: number,
    showPassword?: boolean,
  ): Promise<ICustomer | undefined>;

  search(
    where?: Partial<ICustomer> | Partial<ICustomer>[],
    limit?: number,
    offset?: number,
    showPassword?: boolean,
  ): Promise<ICustomer[]>;

  verify(body: Partial<ICustomer>): Promise<{
    status: boolean;
    message: string | ICustomer;
  }>;

  count(where?: Partial<ICustomer>): Promise<number>;

  update(
    customerId: number,
    fields: Partial<ICustomer>,
  ): Promise<ICustomer | undefined>;

  delete(customerId: number): Promise<boolean>;

  toEntity(input: ICustomer): ECustomer;

  fromEntity(input: ECustomer): ICustomer;
}
