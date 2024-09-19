import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'core/entities/user/user.interface';
import { UserRepositoryInterface } from 'core/repositories/user/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private respository: UserRepositoryInterface,
    private jwtService: JwtService,
  ) {}

  async createUser(body: IUser): Promise<IUser> {
    const { verificationKey, ...user } = await this.respository.add(body);
    const { userId, ...userData } = user;
    const token = await this.jwtService.signAsync({
      verificationKey,
      ...userData,
    });
    return { ...user, token };
  }

  async showUser(userId: number): Promise<IUser | undefined> {
    return await this.respository.find(userId);
  }

  async listUser(where?: Partial<IUser>, limit?: number, offset?: number) {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IUser>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateUser(
    userId: number,
    body: Partial<IUser>,
  ): Promise<IUser | undefined> {
    return await this.respository.update(userId, body);
  }

  async deleteUser(userId: number): Promise<boolean> {
    return await this.respository.delete(userId);
  }

  async verifyAdmin(body: Partial<IUser>): Promise<IUser | undefined> {
    return await this.respository.verifyAdmin(body);
  }
}
