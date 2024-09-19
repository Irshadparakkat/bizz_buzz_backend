import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { InstantOfferService } from './instantOffer.service';
import { InstantOfferController } from './instantOffer.controller';
import { BusinessService } from '../business/business.service';

@Module({
  imports: [RepositoryModule],
  controllers: [InstantOfferController],
  providers: [InstantOfferService, BusinessService],
})
export class InstantOfferModule { }
