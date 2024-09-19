import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { FavouriteStopService } from './favouriteStop.service';
import { FavouriteStopController } from './favouriteStop.controller';
import { CustomerService } from '../customer/customer.service';
import { StopService } from '../stop/stop.service';

@Module({
  imports: [RepositoryModule],
  controllers: [FavouriteStopController],
  providers: [FavouriteStopService, CustomerService, StopService],
})
export class FavouriteStopModule { }
