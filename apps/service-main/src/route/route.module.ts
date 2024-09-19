import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { StopService } from '../stop/stop.service';
import { TripService } from '../trip/trip.service';

@Module({
  imports: [RepositoryModule],
  controllers: [RouteController],
  providers: [RouteService, StopService, TripService],
})
export class RouteModule {}
