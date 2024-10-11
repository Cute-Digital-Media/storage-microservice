import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserAuthGuard } from './guards/user-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserAuthGuard],
  exports: [UserAuthGuard],
})
export class AuthModule {}
