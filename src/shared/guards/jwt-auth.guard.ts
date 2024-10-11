import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    request.user = {
      id: randomUUID(),
      username: 'mockerUser',
    };
    return true;
  }
}
