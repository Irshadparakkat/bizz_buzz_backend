import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IBusiness } from 'core/entities/business/business.interface';
import { EBusiness } from './typeorm/business.entity';
import { BusinessRepositoryInterface } from './business.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class BusinessPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements BusinessRepositoryInterface
{
  async add(business: IBusiness): Promise<IBusiness> {
    await this.init();
    const repository = this.dataSource().getRepository(EBusiness);
    if (business.password) {
      const saltRounds = 10;
      business.password = await bcrypt.hash(business.password, saltRounds);
    }
    const generatedEntity = await repository.save(this.toEntity(business));
    return this.fromEntity(generatedEntity);
  }

  async find(businessId: number): Promise<IBusiness | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EBusiness);
    const entity = await repository.findOne({ where: { businessId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IBusiness> | Partial<IBusiness>[] = {},
    limit?: number,
    offset?: number,
  ): Promise<IBusiness[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EBusiness);
    const userEntity = await repository.find({
      where: this.getWhere(where),
      take: limit,
      skip: offset,
    });
    return userEntity.map((EBusiness) => this.fromEntity(EBusiness));
  }

  async count(where: Partial<IBusiness> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EBusiness);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(input: Partial<IBusiness> | Partial<IBusiness>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<EBusiness> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }
  private getSingleWhere(user: Partial<IBusiness> = {}) {
    const where: FindOptionsWhere<EBusiness> = {};
    where.deletedTime = null;
    if (user.name) where.name = ILike(this.toWildcard(user.name));
    if (user.address) where.address = ILike(this.toWildcard(user.address));
    if (user.businessId) where.businessId = user.businessId;
    if (user.email) where.email = ILike(this.toWildcard(user.email));
    if (user.pincode) where.pincode = ILike(this.toWildcard(user.pincode));
    if (user.phoneNumber)
      where.phoneNumber = ILike(this.toWildcard(user.phoneNumber));
    if (user.username) where.pincode = ILike(this.toWildcard(user.username));
    if (user.status) where.status = user.status;
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    businessId: number,
    fields: Partial<IBusiness>,
  ): Promise<IBusiness | undefined> {
    await this.init();
    if (fields.password) {
      const saltRounds = 10;
      fields.password = await bcrypt.hash(fields.password, saltRounds);
    }
    const repository = this.dataSource().getRepository(EBusiness);
    await repository.update({ businessId }, this.toPartialEntity(fields));
    return this.find(businessId);
  }

  async delete(businessId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EBusiness);
    await repository.softDelete({ businessId });
    return true;
  }

  private toPartialEntity(input: Partial<IBusiness>): Partial<EBusiness> {
    const output = new EBusiness();
    output.name = input?.name;
    output.username = input?.username;
    output.email = input?.email;
    output.status = input?.status;
    output.phoneNumber = input?.phoneNumber;
    output.password = input?.password;
    output.businessType = input?.businessType;
    output.address = input?.address;
    output.state = input?.state;
    output.city = input?.city;
    output.pincode = input?.pincode;
    output.gst = input?.gst;
    output.location = input?.location;
    output.latitude = input?.latitude;
    output.longitude = input?.longitude;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  public toEntity(input: IBusiness): EBusiness {
    const output = new EBusiness();
    output.businessId = input.businessId;
    output.name = input.name;
    output.username = input.username;
    output.email = input.email;
    output.status = input.status;
    output.phoneNumber = input.phoneNumber;
    output.businessType = input.businessType;
    output.address = input.address;
    output.state = input.state;
    output.city = input.city;
    output.pincode = input.pincode;
    output.gst = input.gst;
    output.location = input.location;
    output.latitude = input.latitude;
    output.longitude = input.longitude;
    output.password = input?.password;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  public fromEntity(input: EBusiness): IBusiness {
    const {
      businessId,
      name,
      username,
      email,
      status,
      phoneNumber,
      businessType,
      address,
      state,
      city,
      pincode,
      gst,
      location,
      latitude,
      longitude,
      createdTime,
      updatedTime,
    } = input;
    return {
      businessId,
      name,
      username,
      email,
      status,
      phoneNumber,
      businessType,
      address,
      state,
      city,
      pincode,
      gst,
      location,
      latitude,
      longitude,
      createdTime,
      updatedTime,
    };
  }

  async verify(body: Partial<IBusiness>): Promise<{
    status: boolean;
    message: string | IBusiness;
  }> {
    await this.init();
    const repository = this.dataSource().getRepository(EBusiness);
    const where: FindOptionsWhere<EBusiness>[] = [];
    if (body.phoneNumber) where.push({ phoneNumber: body.phoneNumber });
    if (body.email) where.push({ email: body.email });

    const entity = await repository.findOne({ where });
    if (!entity || !entity?.password) {
      return {
        status: false,
        message: 'Business not found',
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
