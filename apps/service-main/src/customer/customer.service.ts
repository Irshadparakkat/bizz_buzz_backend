import { Inject, Injectable } from '@nestjs/common';
import { ICustomer } from 'core/entities/customer/customer.interface';
import { CustomerRepositoryInterface } from 'core/repositories/customer/customer.repository.interface';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerRepository')
    private respository: CustomerRepositoryInterface,
  ) {}

  async createCustomer(body: ICustomer): Promise<ICustomer> {
    return await this.respository.add(body);
  }

  async showCustomer(
    customerId: number,
    showPassword: boolean = false,
  ): Promise<ICustomer | undefined> {
    return await this.respository.find(customerId, showPassword);
  }

  async listCustomer(
    where?: Partial<ICustomer> | Partial<ICustomer>[],
    limit?: number,
    offset?: number,
    showPassword: boolean = false,
  ): Promise<ICustomer[]> {
    return await this.respository.search(where, limit, offset, showPassword);
  }

  async count(where?: Partial<ICustomer>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateCustomer(
    customerId: number,
    body: Partial<ICustomer>,
  ): Promise<ICustomer | undefined> {
    return await this.respository.update(customerId, body);
  }

  async deleteCustomer(customerId: number): Promise<boolean> {
    return await this.respository.delete(customerId);
  }

  async verify(
    body: Partial<ICustomer>,
  ): Promise<{ status: boolean; message: string | ICustomer }> {
    return await this.respository.verify(body);
  }
}
