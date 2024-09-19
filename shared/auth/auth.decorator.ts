import { SetMetadata } from '@nestjs/common';
import { Permission } from './auth.permissions';
export const PERMISSION = '';
export const SetPermission = (permission: Permission) =>
  SetMetadata(PERMISSION, permission);
