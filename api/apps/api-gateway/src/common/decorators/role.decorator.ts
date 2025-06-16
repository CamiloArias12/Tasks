import { EUserRole } from 'libs/user/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
