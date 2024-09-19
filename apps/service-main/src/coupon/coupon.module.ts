import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CustomerService } from '../customer/customer.service';
import { SettingService } from '../setting/setting.service';
import { BusinessService } from '../business/business.service';

@Module({
  imports: [RepositoryModule],
  controllers: [CouponController],
  providers: [CouponService, CustomerService, BusinessService, SettingService],
})
export class CouponModule {}
