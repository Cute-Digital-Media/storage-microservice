import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { LogoutProvider } from '../providers/logout.provider';

@Injectable()
export class AccessTokenGuard implements CanActivate {

    constructor(
        /**
         * Inject JwtService
         */
        private readonly jwtService: JwtService,

        /**
         * Inject JwtConfiguration
         */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        /**
      * Inject BlacklistService
      */
        private readonly logOutProvider: LogoutProvider
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        // Extract the request from the execution context
        const request = context.switchToHttp().getRequest();
        // Extract the token from the header
        const token = this.extractTokenFromCookie(request)
        // validate the token
        // Check if the token is blacklisted


        if (token && await this.logOutProvider.isTokenBlacklisted(token)) {
            throw new UnauthorizedException(); // Token está en la lista negra
        }

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

            request[REQUEST_USER_KEY] = payload
        } catch (error) {
            throw new UnauthorizedException()
        }

        return true;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.jwt; // Cambia 'jwt' por el nombre que usaste para la cookie
    }
}
