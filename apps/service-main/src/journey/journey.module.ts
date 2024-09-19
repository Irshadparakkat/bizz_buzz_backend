import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { DriverService } from '../driver/driver.service';
import { TripService } from '../trip/trip.service';

@Module({
  imports: [RepositoryModule],
  controllers: [JourneyController],
  providers: [JourneyService, DriverService, TripService],
})
export class JourneyModule {}
