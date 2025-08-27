import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRole } from 'src/constant/db/user-role';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: [UserRole, ...UserRole[]]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden - Admin role required' }),
  );
};
