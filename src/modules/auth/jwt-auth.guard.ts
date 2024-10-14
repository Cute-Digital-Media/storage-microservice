import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        console.log('Authorization Header:', request.headers.authorization);
        const token = request.headers.authorization?.split(' ')[1];

        if (token === 'fake-jwt-token') {
            return true;
        }
        return false;
    }

}
