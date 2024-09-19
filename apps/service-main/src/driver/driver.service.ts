import { Inject, Injectable } from '@nestjs/common';
import {
  IDriver,
  IDriverTripTiming,
} from 'core/entities/driver/driver.interface';
import { DriverRepositoryInterface } from 'core/repositories/driver/driver.repository.interface';
import { SmsService } from 'shared/service/sms.service';

@Injectable()
export class DriverService {
  private smsService: SmsService = new SmsService();
  constructor(
    @Inject('DriverRepository')
    private respository: DriverRepositoryInterface,
  ) {}

  async createDriver(body: IDriver): Promise<IDriver> {
    const driver = await this.respository.add({ ...body });
    this.smsService.sendWelcomMessageDriver({
      username: driver.name,
      password: body.password,
      userphone: driver.phoneNumber,
    });
    return driver;
  }

  async showDriver(driverId: number): Promise<IDriver | undefined> {
    return await this.respository.find(driverId);
  }

  async listDriver(
    where?: Partial<IDriver> | Partial<IDriver>[],
    limit?: number,
    offset?: number,
  ): Promise<IDriver[]> {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IDriver>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateDriver(
    driverId: number,
    body: Partial<IDriver>,
  ): Promise<IDriver | undefined> {
    return await this.respository.update(driverId, body);
  }

  async deleteDriver(driverId: number): Promise<boolean> {
    return await this.respository.delete(driverId);
  }

  async tripTiming(driverId: number): Promise<IDriverTripTiming[]> {
    return await this.respository.tripTiming(driverId);
  }

  async verify(
    body: Partial<IDriver>,
  ): Promise<{ status: boolean; message: string | IDriver }> {
    return await this.respository.verify(body);
  }
}
