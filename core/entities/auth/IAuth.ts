export enum UserTypes {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
  DRIVER = 'DRIVER',
}

export interface UserInfo {
  email: string;
  token: string;
  type: UserTypes;
}
