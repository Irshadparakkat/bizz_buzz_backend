import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
