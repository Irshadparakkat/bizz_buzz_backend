import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { Response, Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAuth } from './dto/response.auth.dto';
import { CreateGoogleSignUpDto } from './dto/auth.dto';
import { GoogleAuthService } from 'shared/auth/google-auth';
import { CustomerService } from '../customer/customer.service';
import { ICustomer } from 'core/entities/customer/customer.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AdminSigninDto } from './dto/admin.signin.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { GmailService } from 'shared/service/gmail.service';
import { SuccessOutputDTO } from 'shared/output/dto/success.output.dto';
import { ResponseUser } from '../user/dto/response.user.dto';
import { ResponseCustomer } from '../customer/dto/response.customer.dto';
import { CreateCustomerDto } from '../customer/dto/create.customer.dto';
import {
  forgotPasswordCustomerDto as forgotPasswordDto,
  resetPasswordCustomerDto as resetPasswordDto,
  signinCustomerDto,
  verifyCustomerDto as verifyOtpDto,
} from '../customer/dto/signin.customer.dto';
import { SmsService } from 'shared/service/sms.service';
import { DriverService } from '../driver/driver.service';
import { IDriver } from 'core/entities/driver/driver.interface';
import { ResponseDriver } from '../driver/dto/response.driver.dto';
import { IUser } from 'core/entities/user/user.interface';
import { BusinessService } from '../business/business.service';
import { ResponseBusiness } from '../business/dto/response.business.dto';
import { IBusiness } from 'core/entities/business/business.interface';
import { UserTypes } from 'core/entities/auth/IAuth';
import { RandomStringGenerator } from 'shared/service/random.string.genrator.service';

@ApiTags('SignIn')
@Controller('')
export class AdController {
  constructor(
    private readonly jwtService: JwtService,
    private customerService: CustomerService,
    private userservice: UserService,
    private driverservice: DriverService,
    private businessService: BusinessService,
  ) {}
  singleOutput: SingleOutput<ICustomer | IDriver | IUser> = new SingleOutput<
    ICustomer | IDriver | IUser | IBusiness
  >();
  errorOutput: ErrorOutput = new ErrorOutput();
  gmailService: GmailService = new GmailService();
  qoogleAuthService: GoogleAuthService = new GoogleAuthService();
  private smsService: SmsService = new SmsService();
  private keyService: RandomStringGenerator = new RandomStringGenerator();

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'Signup Customer',
  })
  @Post('customer/signup/google')
  @Post('customer/signup/facebook')
  async customerSignupGoogle(
    @Req() request: Request,
    @Body() body: CreateGoogleSignUpDto,
    @Res() res: Response,
  ) {
    const googleInfo = await this.qoogleAuthService.verifyIdToken(body.token);
    const existingUser = await this.customerService.listCustomer(
      [
        {
          loginToken: googleInfo.loginToken,
        },
        {
          email: googleInfo.email ?? 'not-a-valid-email',
        },
      ],
      1,
      0,
      true,
    );
    if (existingUser.length > 0) {
      const badReq = [];
      (existingUser[0].email === googleInfo.email ||
        existingUser[0].loginToken === googleInfo.loginToken) &&
        badReq.push('email already exist');
      throw this.errorOutput.badRequestError(res, badReq);
    }
    const customer = await this.customerService.createCustomer({
      ...googleInfo,
      password: this.keyService.generateRandomString(15),
      verified: true,
    });

    if (request.headers['platform'] == 'MOBILE') {
      customer.accessToken = this.jwtService.sign({
        email: customer.email,
        token: customer.password,
        type: UserTypes.CUSTOMER,
      });
      delete customer.password;
    }
    return this.singleOutput.single(res, customer, 'customer', true);
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'Signin Customer',
  })
  @Post('customer/signin/google')
  @Post('customer/signin/facebook')
  async customerSignInGoogle(
    @Req() request: Request,
    @Body() body: CreateGoogleSignUpDto,
    @Res() res: Response,
  ) {
    const googleInfo = await this.qoogleAuthService.verifyIdToken(body.token);
    const customer = await this.customerService.listCustomer(
      [
        {
          loginToken: googleInfo.loginToken,
        },
        {
          email: googleInfo.email ?? 'not-a-valid-email',
        },
      ],
      1,
      0,
      true,
    );
    if (customer.length == 0) {
      throw this.errorOutput.notFound(res, 'customer');
    }
    if (customer[0].verified == false) {
      throw this.errorOutput.badRequestError(res, ['User not verified']);
    }

    if (request.headers['platform'] == 'MOBILE') {
      customer[0].accessToken = this.jwtService.sign({
        email: customer[0].email,
        token: customer[0].password,
        type: UserTypes.CUSTOMER,
      });
      delete customer[0].password;
    }

    return this.singleOutput.single(res, customer[0], 'customer', true);
  }

  @ApiResponse({
    status: 201,
    description: 'admin signin',
    type: ResponseUser,
  })
  @Post('admin/signin')
  async signin(@Body() body: AdminSigninDto, @Res() res: Response) {
    const user = await this.userservice.verifyAdmin({
      newPassword: body.password,
      email: body.email,
    });
    if (!user) {
      return this.errorOutput.customError(
        res,
        'The email or password you entered is incorrect.',
      );
    }
    const token = this.jwtService.sign({
      userId: user.userId,
      email: user.email,
      type: UserTypes.ADMIN,
    });
    res.cookie('adminjwt', token, { httpOnly: true });
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 200,
    description: 'To verify admin',
    type: ResponseUser,
  })
  @Get('admin')
  async verifyAdmin(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token = req.cookies.adminjwt;
    if (!token) {
      return this.errorOutput.unauthorized(res);
    }
    const { userId } = this.jwtService.verify(token);
    if (!userId) {
      return this.errorOutput.unauthorized(res);
    }
    const user = await this.userservice.showUser(userId);
    if (!user) {
      return this.errorOutput.notFound(res, 'user');
    }
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 201,
    description: 'Logout',
    type: SuccessOutputDTO,
  })
  @Get('admin/logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token = req.cookies.adminjwt;
    if (!token) {
      return this.errorOutput.unauthorized(res);
    }
    res.clearCookie('adminjwt', {
      httpOnly: true,
      path: '/',
    });
    return this.singleOutput.singleStatus(res);
  }

  @ApiResponse({
    status: 201,
    description: 'Forgot password',
    type: SuccessOutputDTO,
  })
  @Post('admin/forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userservice.listUser(body);
    if (user.length === 0) {
      return this.errorOutput.notFound(res, 'user');
    }

    const { verificationKey, email } = user[0];
    const token = this.jwtService.sign({ verificationKey, email });
    const resetLink = `${process.env.FRONTEND_URL}reset_password?token=${token}`;
    this.gmailService.sendMail(
      user[0].email,
      'Bizz&Buzz Password reset link',
      `Click here to reset your password: <a href="${resetLink}">Reset Password</a>`,
    );
    return this.singleOutput.singleStatus(res);
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'Create new Customer',
  })
  @Post('customer/signup')
  async customerSignup(
    @Req() request: Request,
    @Body() body: CreateCustomerDto,
    @Res() res: Response,
  ) {
    const condition: Partial<ICustomer>[] = [];
    body.email && condition.push({ email: body.email });
    body.phoneNumber && condition.push({ email: body.phoneNumber });

    const existingUser = await this.customerService.listCustomer(condition);
    if (existingUser.length > 0) {
      if (existingUser[0].verified) {
        const badReq = [];
        existingUser[0].email == body.email &&
          badReq.push('email already exist');
        existingUser[0].phoneNumber == body.phoneNumber &&
          badReq.push('phoneNumber already exist');
        throw this.errorOutput.badRequestError(res, badReq);
      } else {
        await this.customerService.deleteCustomer(existingUser[0].customerId);
      }
    }

    const otp = (await this.smsService.sendOtp(body.phoneNumber)) || 'error';
    const customer = await this.customerService.createCustomer({
      ...body,
      otp,
    });

    if (request.headers['platform'] == 'MOBILE') {
      customer.accessToken = this.jwtService.sign({
        email: customer.email,
        token: customer.password,
        type: UserTypes.CUSTOMER,
      });
      delete customer.password;
    }
    return this.singleOutput.single(res, customer, 'customer', true);
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'Signin Customer',
  })
  @Post('customer/signin')
  async customerSignin(
    @Body() body: signinCustomerDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.verify(body);
    if (!customer) {
      throw this.errorOutput.notFound(res, 'customer');
    }

    if (customer.status == false) {
      throw this.errorOutput.badRequestError(res, [customer.message as string]);
    }

    if (
      typeof customer.message == 'object' &&
      request.headers['platform'] == 'MOBILE'
    ) {
      customer.message.accessToken = this.jwtService.sign({
        email: customer.message.email,
        token: customer.message.password,
        type: UserTypes.CUSTOMER,
      });
      delete customer.message.password;
    }
    return this.singleOutput.single(
      res,
      customer.message as ICustomer,
      'customer',
      true,
    );
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'verify Customer',
  })
  @Post('customer/verify')
  async customerVerify(@Body() body: verifyOtpDto, @Res() res: Response) {
    const customer = await this.customerService.listCustomer({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (customer.length > 0) {
      this.customerService.updateCustomer(customer[0].customerId, {
        verified: true,
        otp: 'validated',
      });
      return this.singleOutput.single(res, customer[0], 'customer', true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'forgot password for Customer',
  })
  @Post('customer/forgot-password')
  async forgotCutomerVerify(
    @Body() body: forgotPasswordDto,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.listCustomer({
      phoneNumber: body.phoneNumber,
    });
    if (customer.length > 0) {
      this.customerService.updateCustomer(customer[0].customerId, {
        otp: (await this.smsService.sendOtp(body.phoneNumber)) || 'error',
      });
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.notFound(res, 'customer');
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'forgot password for Customer',
  })
  @Post('customer/verifyOtp')
  async otpVerify(@Body() body: verifyOtpDto, @Res() res: Response) {
    const customer = await this.customerService.listCustomer({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (customer.length > 0) {
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }

  @ApiResponse({
    status: 201,
    type: ResponseCustomer,
    description: 'reset password for Customer',
  })
  @Post('customer/reset-password')
  async resetCustomerPassword(
    @Body() body: resetPasswordDto,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.listCustomer({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (customer.length > 0) {
      this.customerService.updateCustomer(customer[0].customerId, {
        otp: 'verified',
        password: body.password,
        verified: true,
      });
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }

  @ApiResponse({
    status: 201,
    type: ResponseDriver,
    description: 'Signin Driver',
  })
  @Post('driver/signin')
  async driverSignin(
    @Req() request: Request,
    @Body() body: signinCustomerDto,
    @Res() res: Response,
  ) {
    const driver = await this.driverservice.verify(body);
    if (!driver) {
      throw this.errorOutput.notFound(res, 'driver');
    }

    if (driver.status == false) {
      throw this.errorOutput.badRequestError(res, [driver.message as string]);
    }

    if (
      typeof driver.message == 'object' &&
      request.headers['platform'] == 'MOBILE'
    ) {
      driver.message.accessToken = this.jwtService.sign({
        email: driver.message.email,
        token: driver.message.password,
        type: UserTypes.CUSTOMER,
      });
      delete driver.message.password;
    }

    return this.singleOutput.single(
      res,
      driver.message as IDriver,
      'driver',
      true,
    );
  }

  @ApiResponse({
    status: 201,
    type: ResponseDriver,
    description: 'forgot password for Driver',
  })
  @Post('driver/forgot-password')
  async forgotDriverPassword(
    @Body() body: forgotPasswordDto,
    @Res() res: Response,
  ) {
    const driver = await this.driverservice.listDriver({
      phoneNumber: body.phoneNumber,
    });
    if (driver.length > 0) {
      this.driverservice.updateDriver(driver[0].driverId, {
        otp: (await this.smsService.sendOtp(body.phoneNumber)) || 'error',
      });
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.notFound(res, 'driver');
  }

  @ApiResponse({
    status: 201,
    type: ResponseDriver,
    description: 'forgot password for Driver',
  })
  @Post('driver/verifyOtp')
  async forgotDriverVerify(@Body() body: verifyOtpDto, @Res() res: Response) {
    const driver = await this.driverservice.listDriver({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (driver.length > 0) {
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }

  @ApiResponse({
    status: 201,
    type: ResponseDriver,
    description: 'reset password for Driver',
  })
  @Post('driver/reset-password')
  async resetDriverPassword(
    @Body() body: resetPasswordDto,
    @Res() res: Response,
  ) {
    const driver = await this.driverservice.listDriver({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (driver.length > 0) {
      this.driverservice.updateDriver(driver[0].driverId, {
        otp: 'verified',
        password: body.password,
      });
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }

  @ApiResponse({
    status: 201,
    type: ResponseBusiness,
    description: 'Signin Business',
  })
  @Post('business/signin')
  async businessSignin(
    @Req() request: Request,
    @Body() body: signinCustomerDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.verify(body);
    if (!business) {
      throw this.errorOutput.notFound(res, 'business');
    }

    if (business.status == false) {
      throw this.errorOutput.badRequestError(res, [business.message as string]);
    }

    if (
      typeof business.message == 'object' &&
      request.headers['platform'] == 'MOBILE'
    ) {
      business.message.accessToken = this.jwtService.sign({
        email: business.message.email,
        token: business.message.password,
        type: UserTypes.CUSTOMER,
      });
      delete business.message.password;
    }
    return this.singleOutput.single(
      res,
      business.message as IBusiness,
      'business',
      true,
    );
  }

  @ApiResponse({
    status: 201,
    type: ResponseBusiness,
    description: 'forgot password for Business',
  })
  @Post('business/forgot-password')
  async forgotBusinessPassword(
    @Body() body: forgotPasswordDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.listBusiness({
      phoneNumber: body.phoneNumber,
    });
    if (business.length > 0) {
      this.businessService.updateBusiness(business[0].businessId, {
        otp: (await this.smsService.sendOtp(body.phoneNumber)) || 'error',
      });
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.notFound(res, 'business');
  }

  @ApiResponse({
    status: 201,
    type: ResponseDriver,
    description: 'forgot password for Driver',
  })
  @Post('business/verifyOtp')
  async forgotBusinessVerify(@Body() body: verifyOtpDto, @Res() res: Response) {
    const business = await this.businessService.listBusiness({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (business.length > 0) {
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }

  @ApiResponse({
    status: 201,
    type: ResponseBusiness,
    description: 'reset password for Business',
  })
  @Post('business/reset-password')
  async resetBusinessPassword(
    @Body() body: resetPasswordDto,
    @Res() res: Response,
  ) {
    const business = await this.businessService.listBusiness({
      phoneNumber: body.phoneNumber,
      otp: body.otp,
    });
    if (business.length > 0) {
      this.businessService.updateBusiness(business[0].businessId, {
        otp: 'verified',
        password: body.password,
      });
      return this.singleOutput.singleStatus(res, true);
    }
    return this.errorOutput.badRequestError(res, ['Invalid OTP']);
  }
}
