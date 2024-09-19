import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { ISetting } from 'core/entities/setting/setting.interface';
import { ESetting } from './typeorm/setting.entity';
import { SettingRepositoryInterface } from './setting.repository.interface';

@Injectable()
export class SettingPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements SettingRepositoryInterface
{
  async find(settingId: number): Promise<ISetting | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ESetting);
    const entity = await repository.findOne({ where: { settingId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async add(): Promise<ISetting | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ESetting);
    await repository.save({ settingId: 1 });
    return this.find(1);
  }

  async update(
    settingId: number,
    fields: Partial<ISetting>,
  ): Promise<ISetting | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(ESetting);
    await repository.save(await this.toPartialEntity(fields));
    return this.find(settingId);
  }

  private toPartialEntity(input: Partial<ISetting>): Partial<ESetting> {
    const output = new ESetting();
    output.minConversionPoints = input?.minConversionPoints;
    output.minClaimPoints = input?.minClaimPoints;
    output.rewardExpiryInDays = input?.rewardExpiryInDays;
    output.fullAdWatchedPoints = input?.fullAdWatchedPoints;
    output.fiveSecAdWatchedPoints = input?.fiveSecAdWatchedPoints;
    output.createdTime = input?.createdTime;
    output.updatedTime = input?.updatedTime;
    return output;
  }

  private fromEntity(input: ESetting): ISetting {
    return {
      settingId: input.settingId,
      minConversionPoints: input?.minConversionPoints,
      minClaimPoints: input?.minClaimPoints,
      rewardExpiryInDays: input?.rewardExpiryInDays,
      fullAdWatchedPoints: input?.fullAdWatchedPoints,
      fiveSecAdWatchedPoints: input?.fiveSecAdWatchedPoints,
      createdTime: input?.createdTime,
      updatedTime: input?.updatedTime,
    };
  }
}
