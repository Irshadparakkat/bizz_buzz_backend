import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { IUser } from 'core/entities/user/user.interface';
import { EUser } from './typeorm/user.entity';
import { UserRepositoryInterface } from './user.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements UserRepositoryInterface
{
  async add(user: IUser): Promise<IUser> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    if (user.newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.newPassword = await bcrypt.hash(user.newPassword, salt);
    }
    const generatedEntity = await repository.save(this.toEntity(user));
    return this.fromEntity(generatedEntity);
  }

  private toEntity(input: IUser): EUser {
    const output = new EUser();
    output.name = input.name;
    output.email = input.email;
    output.verificationKey = input.verificationKey;
    return output;
  }

  async find(userId: number): Promise<IUser | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const entity = await repository.findOne({ where: { userId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IUser> = {},
    limit?: number,
    offset?: number,
  ): Promise<IUser[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const userEntity = await repository.find({
      where: this.getWhere(where),
      take: limit,
      skip: offset,
    });
    return userEntity.map((EUser) => this.fromEntity(EUser));
  }

  async count(where: Partial<IUser> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(user: Partial<IUser> = {}) {
    const where: FindOptionsWhere<EUser> = {};
    if (user.name) where.name = ILike(this.toWildcard(user.name));
    if (user.email) where.email = ILike(this.toWildcard(user.email));
    if (user.verificationKey)
      where.verificationKey = ILike(this.toWildcard(user.verificationKey));
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    userId: number,
    fields: Partial<IUser>,
  ): Promise<IUser | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    if (fields.newPassword) {
      const salt = await bcrypt.genSalt(10);
      fields.newPassword = await bcrypt.hash(fields.newPassword, salt);
    }
    await repository.update({ userId }, this.toPartialEntity(fields));
    return await this.find(userId);
  }

  async delete(userId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    await repository.delete({ userId });
    return true;
  }

  private toPartialEntity(input: Partial<IUser>): Partial<EUser> {
    const output = new EUser();
    output.name = input?.name;
    output.email = input?.email;
    output.verificationKey = input?.verificationKey;
    output.newPassword = input.newPassword;
    return output;
  }

  private fromEntity(input: EUser): IUser {
    return {
      verificationKey: input.verificationKey,
      userId: input.userId,
      name: input.name,
      email: input.email,
    };
  }

  async verifyAdmin(body: Partial<IUser>): Promise<IUser | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const entity = await repository.findOne({ where: { email: body.email } });
    if (!entity || !entity?.newPassword) {
      return undefined;
    }
    const isPasswordValid = await bcrypt.compare(
      body.newPassword,
      entity.newPassword,
    );
    if (!isPasswordValid) {
      return undefined;
    }
    return this.fromEntity(entity);
  }
}
