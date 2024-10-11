import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserMocker } from 'src/interface/user-mocker';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserMocker => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
