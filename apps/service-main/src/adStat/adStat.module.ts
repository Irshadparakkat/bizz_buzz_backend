import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { AdStatService } from './adStat.service';
import { AdStatController } from './adStat.controller';
import { AdService } from '../ad/ad.service';
import { CustomerService } from '../customer/customer.service';
import { SettingService } from '../setting/setting.service';
import { BusinessService } from '../business/business.service';

@Module({
  imports: [RepositoryModule],
  controllers: [AdStatController],
  providers: [
    AdStatService,
    CustomerService,
    AdService,
    BusinessService,
    SettingService,
  ],
})
export class AdStatModule {}
