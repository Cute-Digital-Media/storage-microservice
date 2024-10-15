import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ForbiddenException('Token not found');
        }

        try {

            const decoded = this.jwtService.verify(token, { secret: 'secret' });

            request.user = decoded;

            return true;

        } catch (error) {

            throw new ForbiddenException('Invalid token');

        }
    }
}