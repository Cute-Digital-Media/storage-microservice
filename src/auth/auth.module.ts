import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/signin.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { LogoutProvider } from './providers/logout.provider';


@Module({
    controllers: [AuthController],
    providers: [AuthService, SignInProvider, LogoutProvider, {
        provide: HashingProvider,
        useClass: BcryptProvider
    }],
    imports: [forwardRef(() => UsersModule), ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())],
    exports: [AuthService, HashingProvider, LogoutProvider]
})
export class AuthModule { }
