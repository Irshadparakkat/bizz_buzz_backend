import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { BusService } from '../bus/bus.service';

@Module({
  imports: [RepositoryModule],
  controllers: [DriverController],
  providers: [DriverService, BusService],
})
export class DriverModule {}
