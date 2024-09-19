import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { BusinessService } from '../business/business.service';

@Module({
  imports: [RepositoryModule],
  controllers: [AdController],
  providers: [AdService, BusinessService],
})
export class AdModule {}