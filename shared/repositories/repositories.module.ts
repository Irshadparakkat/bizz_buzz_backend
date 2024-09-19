import { Module } from '@nestjs/common';
import { BusinessPostgreSQLRepository } from 'core/repositories/business/business.postgresql.repository';
import { CustomerPostgreSQLRepository } from 'core/repositories/customer/customer.postgresql.repository';
import { DriverPostgreSQLRepository } from 'core/repositories/driver/driver.postgresql.repository';
import { BusPostgreSQLRepository } from 'core/repositories/bus/bus.postgresql.repository';
import { RoutePostgreSQLRepository } from 'core/repositories/route/route.postgresql.repository';
import { UserPostgreSQLRepository } from 'core/repositories/user/user.postgresql.repository';
import { AdPostgreSQLRepository } from 'core/repositories/ad/ad.postgresql.repository';
import { TripPostgreSQLRepository } from 'core/repositories/trip/trip.postgresql.repository';
import { JourneyPostgreSQLRepository } from 'core/repositories/journey/journey.postgresql.repository';
import { InstantOfferPostgreSQLRepository } from 'core/repositories/instantOffer/instantOffer.postgresql.repository';
import { StopPostgreSQLRepository } from 'core/repositories/stop/stop.postgresql.repository';
import { AdStatPostgreSQLRepository } from 'core/repositories/adStat/adStat.postgresql.repository';
import { SettingPostgreSQLRepository } from 'core/repositories/setting/setting.postgresql.repository';
import { FavouriteStopPostgreSQLRepository } from 'core/repositories/favouriteStop/favouriteStop.postgresql.repository';
import { CouponPostgreSQLRepository } from 'core/repositories/coupon/coupon.postgresql.repository';
import { FavouriteAdPostgreSQLRepository } from 'core/repositories/favouriteAd/favouriteAd.postgresql.repository';

@Module({
  providers: [
    {
      provide: 'BusinessRepository',
      useClass: BusinessPostgreSQLRepository,
    },
    {
      provide: 'CustomerRepository',
      useClass: CustomerPostgreSQLRepository,
    },
    {
      provide: 'DriverRepository',
      useClass: DriverPostgreSQLRepository,
    },
    {
      provide: 'BusRepository',
      useClass: BusPostgreSQLRepository,
    },
    {
      provide: 'RouteRepository',
      useClass: RoutePostgreSQLRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPostgreSQLRepository,
    },
    {
      provide: 'AdRepository',
      useClass: AdPostgreSQLRepository,
    },
    {
      provide: 'TripRepository',
      useClass: TripPostgreSQLRepository,
    },
    {
      provide: 'JourneyRepository',
      useClass: JourneyPostgreSQLRepository,
    },
    {
      provide: 'InstantOfferRepository',
      useClass: InstantOfferPostgreSQLRepository,
    },
    {
      provide: 'StopRepository',
      useClass: StopPostgreSQLRepository,
    },
    {
      provide: 'AdStatRepository',
      useClass: AdStatPostgreSQLRepository,
    },
    {
      provide: 'SettingRepository',
      useClass: SettingPostgreSQLRepository,
    },
    {
      provide: 'FavouriteStopRepository',
      useClass: FavouriteStopPostgreSQLRepository,
    },
    {
      provide: 'CouponRepository',
      useClass: CouponPostgreSQLRepository,
    },
    {
      provide: 'FavouriteAdRepository',
      useClass: FavouriteAdPostgreSQLRepository,
    },
  ],
  exports: [
    'BusinessRepository',
    'CustomerRepository',
    'DriverRepository',
    'BusRepository',
    'RouteRepository',
    'UserRepository',
    'AdRepository',
    'TripRepository',
    'JourneyRepository',
    'InstantOfferRepository',
    'StopRepository',
    'AdStatRepository',
    'SettingRepository',
    'FavouriteStopRepository',
    'CouponRepository',
    'FavouriteAdRepository',
  ],
})
export class RepositoryModule {}
