import { IUser } from "core/entities/user/user.interface";

export interface UserRepositoryInterface {

  add(user: IUser): Promise<IUser>;

  find(userId: number): Promise<IUser | undefined>

  search(where?: Partial<IUser>,  limit?: number, offset?: number): Promise<IUser[]>;

  update(userId: number, fields: Partial<IUser>,): Promise<IUser | undefined>;
  
  count(where?: Partial<IUser>): Promise<number>;

  delete(userId: number): Promise<boolean>;

  verifyAdmin(body: Partial<IUser>): Promise<IUser | undefined>
}