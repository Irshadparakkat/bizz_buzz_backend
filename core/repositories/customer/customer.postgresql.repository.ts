import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { ICustomer } from 'core/entities/customer/customer.interface';
import { ECustomer } from './typeorm/customer.entity';
import { CustomerRepositoryInterface } from './customer.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements CustomerRepositoryInterface
{
  async add(customer: ICustomer): Promise<ICustomer> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    if (customer.password) {
      const saltRounds = 10;
      customer.password = await bcrypt.hash(customer.password, saltRounds);
    }
    const generatedEntity = await repository.save(this.toEntity(customer));
    return this.fromEntity(generatedEntity, true);
  }

  public toEntity(input: ICustomer): ECustomer {
    const output = new ECustomer();
    output.customerId = input.customerId;
    output.name = input.name;
    output.email = input.email;
    if (input.loginToken) output.loginToken = input.loginToken;
    if (input.status) output.status = input.status;
    output.phoneNumber = input.phoneNumber;
    if (input.bloodGroup) output.bloodGroup = input.bloodGroup;
    if (input.donationStatus) output.donationStatus = input.donationStatus;
    if (input.password) output.password = input.password;
    if (input.otp) output.otp = input.otp;
    if (input.milestone) output.milestone = input?.milestone;
    output.createdTime = input.createdTime;
    output.updatedTime = input.updatedTime;
    return output;
  }

  public fromEntity(
    input: ECustomer,
    showPassword: boolean = false,
  ): ICustomer {
    return {
      customerId: input.customerId,
      name: input.name,
      email: input.email,
      password: showPassword ? input.password : undefined,
      status: input.status,
      phoneNumber: input.phoneNumber,
      bloodGroup: input.bloodGroup,
      milestone: input.milestone,
      donationStatus: input.donationStatus,
      createdTime: input.createdTime,
      updatedTime: input.updatedTime,
    };
  }

  async find(
    customerId: number,
    showPassword: boolean = false,
  ): Promise<ICustomer | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    const entity = await repository.findOne({ where: { customerId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity, showPassword);
  }

  async search(
    where: Partial<ICustomer> | Partial<ICustomer>[] = {},
    limit?: number,
    offset?: number,
    showPassword: boolean = false,
  ): Promise<ICustomer[]> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    const entity = await repository.find({
      where: this.getWhere(where),
      take: limit,
      skip: offset,
    });
    return entity.map((ECustomer) => this.fromEntity(ECustomer, showPassword));
  }

  async count(where: Partial<ICustomer> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    const entity = await repository.count({
      where: this.getWhere(where),
    });
    return entity;
  }

  private getWhere(input: Partial<ICustomer> | Partial<ICustomer>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<ECustomer> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }

  private getSingleWhere(customer: Partial<ICustomer> = {}) {
    const where: FindOptionsWhere<ECustomer> = {};
    where.deletedTime = null;
    if (customer.name) where.name = ILike(this.toWildcard(customer.name));
    if (customer.email) where.email = ILike(this.toWildcard(customer.email));
    if (customer.password) where.password = customer.password;
    if (customer.loginToken) where.loginToken = customer.loginToken;
    if (customer.phoneNumber)
      where.phoneNumber = ILike(this.toWildcard(customer.phoneNumber));
    if (customer.bloodGroup) where.bloodGroup = customer.bloodGroup;
    if (customer.customerId) where.customerId = customer.customerId;
    if (customer.otp) where.otp = customer.otp;
    if (customer.verified) where.verified = customer.verified;
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    customerId: number,
    fields: Partial<ICustomer>,
  ): Promise<ICustomer | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    if (fields.password) {
      const saltRounds = 10;
      fields.password = await bcrypt.hash(fields.password, saltRounds);
    }
    await repository.update({ customerId }, this.toPartialEntity(fields));
    return this.find(customerId);
  }

  async delete(customerId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    await repository.softDelete({ customerId });
    return true;
  }

  private toPartialEntity(input: Partial<ICustomer>): Partial<ECustomer> {
    const output = new ECustomer();
    output.name = input?.name;
    output.email = input?.email;
    output.loginToken = input?.loginToken;
    output.status = input?.status;
    output.phoneNumber = input?.phoneNumber;
    output.bloodGroup = input?.bloodGroup;
    output.donationStatus = input?.donationStatus;
    output.password = input?.password;
    output.milestone = input?.milestone;
    if (input?.verified) output.verified = input?.verified;
    if (input?.otp !== undefined) output.otp = input?.otp;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  async verify(body: Partial<ICustomer>): Promise<{
    status: boolean;
    message: string | ICustomer;
  }> {
    await this.init();
    const repository = this.dataSource().getRepository(ECustomer);
    const entity = await repository.findOne({
      where: { phoneNumber: body.phoneNumber },
    });
    if (!entity || !entity?.password) {
      return {
        status: false,
        message: 'User not found',
      };
    }

    if (!entity.verified) {
      this.delete(entity.customerId);
      return {
        status: false,
        message: 'User not found',
      };
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      entity.password,
    );
    if (!isPasswordValid) {
      return {
        status: false,
        message: 'Invalid password',
      };
    }
    return {
      status: true,
      message: entity,
    };
  }
}
