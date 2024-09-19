import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SettingService } from '../setting/setting.service';

@Module({
  imports: [RepositoryModule],
  controllers: [CustomerController],
  providers: [CustomerService, SettingService],
})
export class CustomerModule {}
