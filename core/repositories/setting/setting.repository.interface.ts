import { ISetting } from 'core/entities/setting/setting.interface';

export interface SettingRepositoryInterface {
  add(): Promise<ISetting | undefined>;
  find(settingId: number): Promise<ISetting | undefined>;
  update(
    settingId: number,
    fields: Partial<ISetting>,
  ): Promise<ISetting | undefined>;
}
