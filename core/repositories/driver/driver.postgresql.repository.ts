import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import {
  IDriver,
  IDriverTripTiming,
} from 'core/entities/driver/driver.interface';
import { EDriver } from './typeorm/driver.entity';
import { DriverRepositoryInterface } from './driver.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import { BusRepositoryInterface } from '../bus/bus.repository.interface';
import { BusPostgreSQLRepository } from '../bus/bus.postgresql.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class DriverPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements DriverRepositoryInterface
{
  private busRepository: BusRepositoryInterface = new BusPostgreSQLRepository();
  async add(driver: IDriver): Promise<IDriver> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    if (driver.password) {
      const saltRounds = 10;
      driver.password = await bcrypt.hash(driver.password, saltRounds);
    }
    const generatedEntity = await repository.save(this.toEntity(driver));
    return this.fromEntity(generatedEntity);
  }

  public toEntity(input: IDriver): EDriver {
    const output = new EDriver();
    if (input.driverId) output.driverId = input.driverId;
    if (input.otp) output.otp = input.otp;
    output.name = input.name;
    output.email = input?.email;
    output.password = input.password;
    output.phoneNumber = input.phoneNumber;
    output.status = input.status;
    output.role = input.role;
    output.bloodGroup = input?.bloodGroup;
    output.donationStatus = input.donationStatus;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  public fromEntity(input: EDriver): IDriver {
    return {
      driverId: input.driverId,
      name: input.name,
      email: input?.email,
      phoneNumber: input.phoneNumber,
      status: input.status,
      role: input.role,
      bloodGroup: input.bloodGroup,
      donationStatus: input.donationStatus,
      bus: input.bus?.map((bus) => this.busRepository.fromEntity(bus)) ?? [],
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }

  async find(driverId: number): Promise<IDriver | undefined> {
    const entity = await this.findEntity(driverId);
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  private async findEntity(driverId: number) {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    return await repository.findOne({
      where: { driverId },
      relations: ['bus'],
    });
  }

  async search(
    where: Partial<IDriver> | Partial<IDriver>[] = {},
    limit?: number,
    offset?: number,
  ): Promise<IDriver[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    const userEntity = await repository.find({
      where: this.getWhere(where),
      relations: ['bus'],
      take: limit,
      skip: offset,
    });
    return userEntity.map((EDriver) => this.fromEntity(EDriver));
  }

  async count(where: Partial<IDriver> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(input: Partial<IDriver> | Partial<IDriver>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<EDriver> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }

  private getSingleWhere(user: Partial<IDriver> = {}) {
    const where: FindOptionsWhere<EDriver> = {};
    where.deletedTime = null;
    if (user.name) where.name = ILike(this.toWildcard(user.name));
    if (user.email) where.email = ILike(this.toWildcard(user.email));
    if (user.phoneNumber)
      where.phoneNumber = ILike(this.toWildcard(user.phoneNumber));
    if (user.status) where.status = user.status;
    if (user.bloodGroup) where.bloodGroup = user.bloodGroup;
    if (user.donationStatus) where.donationStatus = user.donationStatus;
    if (user.otp) where.otp = user.otp;

    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    driverId: number,
    fields: Partial<IDriver>,
  ): Promise<IDriver | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    if (fields.password) {
      const saltRounds = 10;
      fields.password = await bcrypt.hash(fields.password, saltRounds);
    }
    await repository.save(await this.toPartialEntity({ ...fields, driverId }));
    return this.find(driverId);
  }

  async delete(driverId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    await repository.softDelete({ driverId });
    return true;
  }

  public async toPartialEntity(
    input: Partial<IDriver>,
  ): Promise<Partial<EDriver>> {
    const output = input.driverId
      ? await this.findEntity(input.driverId)
      : new EDriver();
    output.name = input?.name;
    output.email = input?.email;
    output.password = input?.password;
    output.status = input?.status;
    output.phoneNumber = input?.phoneNumber;
    output.role = input?.role;
    output.bloodGroup = input?.bloodGroup;
    output.donationStatus = input?.donationStatus;
    output.updatedTime = input?.updatedTime;
    output.otp = input?.otp;

    if (input.driverId && input.bus !== undefined) {
      output.bus = [];
      input.bus.forEach((bus) => {
        output.bus.push({ ...this.busRepository.toEntity(bus) });
      });
    }
    return output;
  }

  async verify(body: Partial<IDriver>): Promise<{
    status: boolean;
    message: string | IDriver;
  }> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    const entity = await repository.findOne({
      where: { phoneNumber: body.phoneNumber },
    });
    if (!entity || !entity?.password) {
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

  async tripTiming(driverId: number): Promise<IDriverTripTiming[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EDriver);
    const qb = repository.createQueryBuilder('driver');
    qb.innerJoin('driver.bus', 'bus');
    qb.innerJoin('bus.trip', 'trip');
    qb.innerJoin('trip.stopTime', 'stopTime');
    qb.where('driver.driverId = :driverId', {
      driverId: driverId,
    });
    qb.groupBy(
      '"driver"."driverId", "trip"."tripId", "bus"."name", "trip"."tripName"',
    );
    qb.select([
      'driver.driverId as "driverId"',
      'bus.name as "busName"',
      'trip.tripName as "tripName"',
      'trip.tripId as "tripId"',
      "MIN(CONCAT(LPAD(CAST(hour AS TEXT), 2, '0'), ':', LPAD(CAST(min AS TEXT), 2, '0'))) AS \"minTime\"",
    ]);
    const entity = await qb.getRawMany();

    return entity.map((row): IDriverTripTiming => {
      const time = row.minTime?.split(':');
      return {
        driverId: row.driverId as number,
        tripId: row.tripId as number,
        busName: row.busName,
        tripName: row.tripName,
        start: {
          hour: parseInt(time[0]),
          min: parseInt(time[1]),
        },
      };
    });
  }
}
