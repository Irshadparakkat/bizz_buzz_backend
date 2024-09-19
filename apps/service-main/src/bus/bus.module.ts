import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { TripService } from '../trip/trip.service';

@Module({
  imports: [RepositoryModule],
  controllers: [BusController],
  providers: [BusService, TripService],
})
export class BusModule {}
