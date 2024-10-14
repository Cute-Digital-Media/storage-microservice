import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Rol } from '../enums/rol.enums';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY,
      [context.getHandler(),
      context.getClass()
      ]);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest()
    const user = request[REQUEST_USER_KEY];

    if (!user || !user.rol || !Array.isArray(user.rol)) {
      return false; // Denegar acceso si no hay roles definidos
    }
    return user.rol.some(role => roles.includes(role));
  }
}
