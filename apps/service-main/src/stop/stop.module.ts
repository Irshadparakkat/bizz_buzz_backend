import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { StopService } from './stop.service';
import { StopController } from './stop.controller';
import { RouteService } from '../route/route.service';

@Module({
  imports: [RepositoryModule],
  controllers: [StopController],
  providers: [StopService, RouteService],
})
export class StopModule {}
