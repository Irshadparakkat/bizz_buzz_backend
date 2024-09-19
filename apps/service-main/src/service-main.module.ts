import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './business/business.module';
import { CustomerModule } from './customer/customer.module';
import { UserModule } from './user/user.module';
import { DriverModule } from './driver/driver.module';
import { BusModule } from './bus/bus.module';
import { RouteModule } from './route/route.module';
import { AdModule } from './ad/ad.module';
import { TripModule } from './trip/trip.module';
import { JourneyModule } from './journey/journey.module';
import { configureCloudinary } from 'shared/config/cloudinary.config';
import { InstantOfferModule } from './instantOffer/instantOffer.module';
import { StopModule } from './stop/stop.module';
import { AuthModule } from './auth/auth.module';
import { AdStatModule } from './adStat/adStat.module';
import { SettingModule } from './setting/setting.module';
import { FavouriteStopModule } from './favouriteStop/favouriteStop.module';
import { CouponModule } from './coupon/coupon.module';
import { FavouriteAdModule } from './favouriteAd/favouriteAd.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    BusinessModule,
    CustomerModule,
    DriverModule,
    BusModule,
    RouteModule,
    UserModule,
    AdModule,
    TripModule,
    JourneyModule,
    InstantOfferModule,
    StopModule,
    AuthModule,
    AdStatModule,
    SettingModule,
    FavouriteStopModule,
    CouponModule,
    FavouriteAdModule,
    ConfigModule.forRoot({
      envFilePath: [__dirname + '/../.env', __dirname + '/.env'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ServiceMainModule {
  constructor() {
    configureCloudinary();
  }
}
