import { IAdStat, IStats } from 'core/entities/adStat/adStat.interface';

export interface AdStatRepositoryInterface {
  add(ad: IAdStat): Promise<IAdStat>;

  find(adId: number): Promise<IAdStat | undefined>;

  search(
    where?: Partial<IAdStat> | Partial<IAdStat>[],
    limit?: number,
    offset?: number,
  ): Promise<IAdStat[]>;

  count(where?: Partial<IAdStat> | Partial<IAdStat>[]): Promise<number>;

  getStats(
    where?: Partial<IStats>,
    limit?: number,
    offset?: number,
  ): Promise<IStats[]>;

  countStats(where?: Partial<IStats>): Promise<number>;
}
