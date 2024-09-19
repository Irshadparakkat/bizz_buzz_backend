import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
