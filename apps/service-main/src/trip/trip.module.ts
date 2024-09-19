import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { BusService } from '../bus/bus.service';
import { RouteService } from '../route/route.service';
import { StopService } from '../stop/stop.service';

@Module({
  imports: [RepositoryModule],
  controllers: [TripController],
  providers: [TripService, BusService, RouteService, StopService],
})
export class TripModule {}
