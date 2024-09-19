import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IBus } from 'core/entities/bus/bus.interface';
import { EBus } from './typeorm/bus.entity';
import { BusRepositoryInterface } from './bus.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import { EDriver } from '../driver/typeorm/driver.entity';
import { IDriver } from 'core/entities/driver/driver.interface';

@Injectable()
export class BusPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements BusRepositoryInterface {
  async add(bus: IBus): Promise<IBus> {
    await this.init();
    const repository = this.dataSource().getRepository(EBus);
    const generatedEntity = await repository.save(this.toEntity(bus));
    return this.fromEntity(generatedEntity);
  }

  public toEntity(input: IBus): EBus {
    const output = new EBus();
    if (input.busId) output.busId = input.busId;
    output.name = input.name;
    output.vehicleNumber = input.vehicleNumber;
    output.capacity = input.capacity;
    output.status = input.status;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  public fromEntity(input: EBus): IBus {
    return {
      busId: input.busId,
      name: input.name,
      vehicleNumber: input.vehicleNumber,
      capacity: input.capacity,
      status: input.status,
      driver:
        input.driver?.map((driver) => this.fromDriverEntity(driver)) ?? [],
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }

  async find(busId: number): Promise<IBus | undefined> {
    const entity = await this.findEntity(busId);
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  private async findEntity(busId: number) {
    await this.init();
    const repository = this.dataSource().getRepository(EBus);
    return await repository.findOne({
      where: { busId },
      relations: ['driver'],
    });
  }

  async search(
    where: Partial<IBus> = {},
    limit?: number,
    offset?: number,
  ): Promise<IBus[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EBus);
    const userEntity = await repository.find({
      where: this.getWhere(where),
      relations: ['driver'],
      take: limit,
      skip: offset,
    });
    return userEntity.map((EBus) => this.fromEntity(EBus));
  }

  async count(where: Partial<IBus> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EBus);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(input: Partial<IBus> | Partial<IBus>[] = {}) {
    if (Array.isArray(input)) {
      return input.map((val): FindOptionsWhere<EBus> => {
        return this.getSingleWhere(val);
      });
    }
    return this.getSingleWhere(input);
  }

  private getSingleWhere(user: Partial<IBus> = {}) {
    const where: FindOptionsWhere<EBus> = {};
    where.deletedTime = null;
    if (user.name) where.name = ILike(this.toWildcard(user.name));
    if (user.vehicleNumber) where.vehicleNumber = user.vehicleNumber;
    if (user.driver && !Array.isArray(user.driver)) {
      const driverWhere: FindOptionsWhere<EDriver> = {};
      if (user.driver?.driverId) {
        driverWhere.driverId = user.driver?.driverId;
      }
      where.driver = driverWhere;
    }
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }
  async update(
    busId: number,
    fields: Partial<IBus>,
  ): Promise<IBus | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EBus);
    await repository.save(await this.toPartialEntity(fields));
    return this.find(busId);
  }

  async delete(busId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EBus);
    await repository.softDelete({ busId });
    return true;
  }

  public async toPartialEntity(input: Partial<IBus>): Promise<Partial<EBus>> {
    const output = input.busId
      ? await this.findEntity(input.busId)
      : new EBus();
    output.name = input?.name;
    output.vehicleNumber = input?.vehicleNumber;
    output.capacity = input?.capacity;
    output.status = input?.status;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    if (
      input.busId &&
      input.driver !== undefined &&
      Array.isArray(input.driver)
    ) {
      output.driver = [];
      input.driver.forEach((driver) => {
        output.driver.push({ ...this.toDriverEntity(driver) });
      });
    }
    return output;
  }

  private fromDriverEntity(input: EDriver): IDriver {
    return {
      driverId: input.driverId,
      name: input.name,
      email: input?.email,
      phoneNumber: input.phoneNumber,
      status: input.status,
      role: input.role,
      bloodGroup: input.bloodGroup,
      donationStatus: input.donationStatus,
      bus: input.bus?.map((bus) => this.fromEntity(bus)),
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }

  private toDriverEntity(input: IDriver): EDriver {
    const output = new EDriver();
    if (input.driverId) output.driverId = input.driverId;
    output.name = input.name;
    output.email = input?.email;
    output.password = input.password;
    output.phoneNumber = input.phoneNumber;
    output.status = input.status;
    output.role = input.role;
    output.bloodGroup = input?.bloodGroup;
    output.donationStatus = input.donationStatus;
    output.bus = [];
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }
}
