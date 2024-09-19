import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IUser } from 'core/entities/user/user.interface';
import { Response } from 'express';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUser } from './dto/response.user.dto';
import {
  GetParamUserDto,
  GetQueryUserDto,
  GetQueryVerifyUserDto,
} from './dto/get.user.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { JwtService } from '@nestjs/jwt';
import { RandomStringGenerator } from 'shared/service/random.string.genrator.service';
import { GmailService } from 'shared/service/gmail.service';
import { AuthGuard } from 'shared/auth/auth.guard';
import { SetPermission } from 'shared/auth/auth.decorator';
import { Permission } from 'shared/auth/auth.permissions';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private service: UserService,
    private readonly jwtService: JwtService,
  ) {}
  singleOutput: SingleOutput<IUser> = new SingleOutput<IUser>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IUser> = new ListOutput();
  randomStringGenartor: RandomStringGenerator = new RandomStringGenerator();
  gmailService: GmailService = new GmailService();

  @ApiResponse({
    status: 201,
    type: ResponseUser,
    description: 'Create new User',
  })
  @SetPermission(Permission.CreateUser)
  @Post('')
  async create(@Body() body: CreateUserDto, @Res() res: Response) {
    const isUserExist = await this.service.listUser({ email: body.email });
    if (isUserExist.length !== 0) {
      return this.errorOutput.badRequestError(res, ['User already exist']);
    }
    const verificationKey = this.randomStringGenartor.generateRandomString(10);
    const user = await this.service.createUser({ verificationKey, ...body });

    const payload = {
      verificationKey: user.verificationKey,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    const resetLink = `${process.env.FRONTEND_URL}reset_password?token=${token}`;
    this.gmailService.sendMail(
      user.email,
      'Bizz&Buzz Password seting link',
      `Click here to set your password: <a href="${resetLink}">set Password</a>`,
    );
    return this.singleOutput.singleStatus(res);
  }

  @ApiResponse({
    status: 200,
    type: ResponseUser,
    description: 'Get one User by Id',
  })
  @SetPermission(Permission.GetUser)
  @Get(':userId')
  async show(@Param() param: GetParamUserDto, @Res() res: Response) {
    const user = await this.service.showUser(param.userId);
    if (!user) {
      return this.errorOutput.notFound(res, 'user');
    }
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 200,
    type: ResponseUser,
    description: 'List all user',
  })
  @SetPermission(Permission.ListUser)
  @Get('')
  async list(@Res() res: Response, @Query() query: GetQueryUserDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const user = await this.service.listUser(query, limit, offset);
    return this.listOutput.list(
      res,
      user,
      'user',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 201,
    type: ResponseUser,
    description: 'Update password',
  })
  @Put('verify')
  async verify(
    @Query() query: GetQueryVerifyUserDto,
    @Body() body: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    if (!query.token) {
      return this.errorOutput.unauthorized(res);
    }
    const payload = await this.jwtService.verifyAsync(query.token);
    if (payload) {
      const user = await this.service.listUser(payload);
      if (user.length == 0) {
        return this.errorOutput.notFound(res, 'user');
      }
      const verificationKey =
        this.randomStringGenartor.generateRandomString(10);
      const updatedUser = await this.service.updateUser(user[0].userId, {
        ...body,
        verificationKey,
      });
      const { verificationKey: key, ...userData } = updatedUser;
      return this.singleOutput.single(res, userData, 'user');
    }
    return this.errorOutput.unauthorized(res);
  }

  @ApiResponse({
    status: 200,
    type: ResponseUser,
    description: 'Update one user by Id',
  })
  @SetPermission(Permission.UpdateUser)
  @Put(':userId')
  async update(
    @Param() param: GetParamUserDto,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.service.updateUser(param.userId, body);
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete user by Id',
  })
  @SetPermission(Permission.DeleteUser)
  @Delete(':userId')
  async delete(@Param() param: GetParamUserDto, @Res() res: Response) {
    const user = await this.service.showUser(param.userId);
    if (!user) {
      return this.errorOutput.notFound(res, 'user');
    }
    return this.singleOutput.delete(
      res,
      await this.service.deleteUser(param.userId),
    );
  }
}
