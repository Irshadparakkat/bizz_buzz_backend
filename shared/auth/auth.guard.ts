import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  adminPermission,
  businessPermission,
  customerPermission,
  driverPermission,
  Permission,
} from './auth.permissions';
import { PERMISSION } from './auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserInfo, UserTypes } from 'core/entities/auth/IAuth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.getAllAndOverride<Permission>(
      PERMISSION,
      [context.getHandler(), context.getClass()],
    );
    if (permission === undefined) return true;

    const platform = context.switchToHttp().getRequest().headers?.platform;
    const accesstoken = context.switchToHttp().getRequest()
      .headers?.accesstoken;

    if (platform == 'MOBILE') {
      return true;
      // const userInfo: UserInfo = this.jwtService.decode(accesstoken);
      // this.validateUser(userInfo, permission);
    } else {
    }
    // this.authError();
    return true;
  }

  private validateUser(userInfo: UserInfo, permission: Permission) {
    const validate =
      {
        [UserTypes.ADMIN]: this.validateAdmin,
        [UserTypes.BUSINESS]: this.validateBusiness,
        [UserTypes.DRIVER]: this.validateDriver,
        [UserTypes.CUSTOMER]: this.validateCustomer,
      }[userInfo.type] ?? undefined;
    return validate(userInfo, permission);
  }

  private validateAdmin(userInfo: UserInfo, permission: Permission) {
    if (adminPermission.includes(permission)) {
      console.log('admin have permission');
    } else {
      console.log('admin not have permission');
    }
    return true;
  }

  private validateBusiness(userInfo: UserInfo, permission: Permission) {
    if (businessPermission.includes(permission)) {
      console.log('business have permission');
    } else {
      console.log('business not have permission');
    }
    return true;
  }

  private validateDriver(userInfo: UserInfo, permission: Permission) {
    if (driverPermission.includes(permission)) {
      console.log('driver have permission');
    } else {
      console.log('driver not have permission');
    }
    return true;
  }

  private validateCustomer(userInfo: UserInfo, permission: Permission) {
    if (customerPermission.includes(permission)) {
      console.log('customer have permission');
    } else {
      console.log('customer not have permission');
    }
    return true;
  }

  private authError() {
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'You are not allowed to perform this action',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
