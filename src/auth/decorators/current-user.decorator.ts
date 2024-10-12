import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) {
      throw new InternalServerErrorException(
        'No user inside request - make sure that we use the AuthGuard',
      );
    }

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) return user;
    }
    return new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles}]`,
    );
  },
);
