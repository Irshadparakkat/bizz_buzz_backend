/* eslint-disable @typescript-eslint/ban-types */
import { DataSource, EntitySchema } from 'typeorm';
import { EBusiness } from './business/typeorm/business.entity';
import { ECustomer } from './customer/typeorm/customer.entity';
import { EDriver } from './driver/typeorm/driver.entity';
import { EBus } from './bus/typeorm/bus.entity';
import { ERoute } from './route/typeorm/route.entity';
import { EUser } from './user/typeorm/user.entity';
import { EAd } from './ad/typeorm/ad.entity';
import { ETrip, ETripStopTime } from './trip/typeorm/trip.entity';
import { EJourney } from './journey/typeorm/journey.entity';
import { EStop } from './stop/typeorm/stop.entity';
import { EInstantOffer } from './instantOffer/typeorm/instantOffer.entity';
import { ERouteStop } from './route/typeorm/stop.route.entity';
import { EAdStat } from './adStat/typeorm/adStat.entity';
import { ESetting } from './setting/typeorm/setting.entity';
import { EFavouriteStop } from './favouriteStop/typeorm/favouriteStop.entity';
import { ECoupon } from './coupon/typeorm/coupon.entity';
import { EFavouriteAd } from './favouriteAd/typeorm/favouriteAd.entity';

export abstract class BasePostgreSQLRepository {
  /**
   * Main datasource that will be used
   */
  private static dataSource: DataSource;

  /**
   * Migrations files to be used
   */
  protected static migrations: Array<Function | string> = [];

  /**
   * Migrations files to be used
   */
  protected static entities: Array<Function | string | EntitySchema> = [
    EBusiness,
    ECustomer,
    EDriver,
    EBus,
    ERoute,
    EUser,
    ETrip,
    EAd,
    EJourney,
    EStop,
    ERouteStop,
    EInstantOffer,
    ETripStopTime,
    EAdStat,
    ESetting,
    EFavouriteStop,
    ECoupon,
    EFavouriteAd,
  ];

  /**
   * Indicates if schema sould be syncronized with entities or not
   */
  protected static synchronize = true;

  /**
   * Indicates if the queries should be logged or not for debugging
   */
  protected static logging = false;

  /**
   * Indicates if the Datasource is initialized or not
   */
  private static initialized = false;

  protected async init(): Promise<void> {
    if (BasePostgreSQLRepository.dataSource) {
      return;
    }

    BasePostgreSQLRepository.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRESQL_HOST,
      port: parseInt(process.env.POSTGRESQL_PORT),
      username: process.env.POSTGRESQL_USERNAME,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE,
      entities: BasePostgreSQLRepository.entities,
      synchronize: BasePostgreSQLRepository.synchronize,
      logging: BasePostgreSQLRepository.logging,
      migrations: BasePostgreSQLRepository.migrations,
    });
    await BasePostgreSQLRepository.dataSource.initialize();
    await BasePostgreSQLRepository.dataSource.runMigrations();
    BasePostgreSQLRepository.initialized = true;
  }

  protected dataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('Data source not ready yet!');
    }

    return BasePostgreSQLRepository.dataSource;
  }

  public static isInitialized(): boolean {
    return BasePostgreSQLRepository.initialized;
  }

  public static async destroyDatasource() {
    await BasePostgreSQLRepository.dataSource.destroy();
    BasePostgreSQLRepository.dataSource = null;
    BasePostgreSQLRepository.initialized = false;
  }
}
