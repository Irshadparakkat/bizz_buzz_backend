import { Inject, Injectable } from '@nestjs/common';
import { ISetting } from 'core/entities/setting/setting.interface';
import { SettingRepositoryInterface } from 'core/repositories/setting/setting.repository.interface';

@Injectable()
export class SettingService {
  constructor(
    @Inject('SettingRepository')
    private respository: SettingRepositoryInterface,
  ) {}

  async showSetting(settingId: number = 1): Promise<ISetting | undefined> {
    return (
      (await this.respository.find(settingId)) ?? (await this.respository.add())
    );
  }

  async updateSetting(
    body: Partial<ISetting>,
    settingId: number = 1,
  ): Promise<ISetting | undefined> {
    return await this.respository.update(settingId, body);
  }
}
