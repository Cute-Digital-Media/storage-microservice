import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from '../../user/user.module';
import { AuthController } from './auth.controller';
import { UserService } from '../../user/user.service';
import { UserLoginUseCase } from './app/use-cases/user.login.use-case';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRegisterUseCase } from './app/use-cases/user.register.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: new ConfigService().get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  providers: [AuthService, UserService, JwtStrategy, UserLoginUseCase, UserRegisterUseCase],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
