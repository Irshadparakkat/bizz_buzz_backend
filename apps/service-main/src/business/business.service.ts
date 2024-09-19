import { Inject, Injectable } from '@nestjs/common';
import { IBusiness } from 'core/entities/business/business.interface';
import { BusinessRepositoryInterface } from 'core/repositories/business/business.repository.interface';
import { SmsService } from 'shared/service/sms.service';

@Injectable()
export class BusinessService {
  constructor(
    @Inject('BusinessRepository')
    private respository: BusinessRepositoryInterface,
  ) {}
  private smsService: SmsService = new SmsService();

  async createBusiness(body: IBusiness): Promise<IBusiness> {
    const password = this.smsService.generateRandom4DigitNumber();
    const business = await this.respository.add({
      ...body,
      password,
    });
    this.smsService.sendWelcomMessageBusiness({
      username: business.name,
      password,
      userphone: business.phoneNumber,
    });
    return business;
  }

  async showBusiness(businessId: number): Promise<IBusiness | undefined> {
    return await this.respository.find(businessId);
  }

  async listBusiness(
    where?: Partial<IBusiness> | Partial<IBusiness>[],
    limit?: number,
    offset?: number,
  ): Promise<IBusiness[]> {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IBusiness>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateBusiness(
    businessId: number,
    body: Partial<IBusiness>,
  ): Promise<IBusiness | undefined> {
    return await this.respository.update(businessId, body);
  }

  async deleteBusiness(businessId: number): Promise<boolean> {
    return await this.respository.delete(businessId);
  }

  async verify(
    body: Partial<IBusiness>,
  ): Promise<{ status: boolean; message: string | IBusiness }> {
    return await this.respository.verify(body);
  }
}
