import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { FavouriteAdService } from './favouriteAd.service';
import { FavouriteAdController } from './favouriteAd.controller';
import { CustomerService } from '../customer/customer.service';
import { AdService } from '../ad/ad.service';

@Module({
  imports: [RepositoryModule],
  controllers: [FavouriteAdController],
  providers: [FavouriteAdService, CustomerService, AdService],
})
export class FavouriteAdModule { }
