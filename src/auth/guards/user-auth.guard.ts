import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export interface JwtPayload {
  user_id: string;
  role: string;
  tenant: string;
}

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    try {
      const payload = this.decodeToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private decodeToken(token: string): JwtPayload {
    const mockedPayload: JwtPayload = {
      user_id: '123456',
      role: 'admin',
      tenant: 'example_tenant',
    };

    return mockedPayload;
  }
}
