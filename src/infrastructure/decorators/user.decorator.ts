import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { User as UserI } from '../../modules/users/domain/user.domain';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserI => {
    const request = ctx.switchToHttp().getRequest();

    // Simulamos un usuario logueado creando un mock de los datos del usuario.
    // En una aplicación real, esto sería gestionado por Passport u otro sistema de autenticación.
    request.user = new UserI({
      email: 'user.mock@gmail.com',
      id: randomUUID(),
    });

    return request.user;
  },
);
