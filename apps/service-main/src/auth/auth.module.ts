import { Module } from '@nestjs/common';
import { RepositoryModule } from 'shared/repositories/repositories.module';
import { AdController } from './auth.controller';
import { CustomerService } from '../customer/customer.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { DriverService } from '../driver/driver.service';
import { BusinessService } from '../business/business.service';
@Module({
  imports: [
    RepositoryModule,
    JwtModule.register({
      global: true,
      secret: 'jwtsecret',
    }),
  ],
  controllers: [AdController],
  providers: [CustomerService, UserService, DriverService, BusinessService],
})
export class AuthModule {}
