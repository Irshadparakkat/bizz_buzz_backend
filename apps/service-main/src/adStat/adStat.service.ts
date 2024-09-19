import { Inject, Injectable } from '@nestjs/common';
import { IAdStat, IStats } from 'core/entities/adStat/adStat.interface';
import { AdStatRepositoryInterface } from 'core/repositories/adStat/adStat.repository.interface';

@Injectable()
export class AdStatService {
  constructor(
    @Inject('AdStatRepository')
    private repository: AdStatRepositoryInterface,
  ) {}

  async watchAdStat(body: IAdStat): Promise<IAdStat> {
    return await this.repository.add(body);
  }

  async showAdStat(adId: number): Promise<IAdStat | undefined> {
    return await this.repository.find(adId);
  }

  async listAdStat(
    where?: Partial<IAdStat> | Partial<IAdStat>[],
    limit?: number,
    offset?: number,
  ) {
    return await this.repository.search(where, limit, offset);
  }

  async count(where?: Partial<IAdStat> | Partial<IAdStat>[]): Promise<number> {
    return await this.repository.count(where);
  }

  async getStats(
    query: IStats,
    limit?: number,
    offset?: number,
  ): Promise<IStats[]> {
    return await this.repository.getStats(query, limit, offset);
  }

  async statsCount(query: IStats): Promise<number> {
    return await this.repository.countStats(query);
  }
}
