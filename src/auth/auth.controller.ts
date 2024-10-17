import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from './dto/login-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register-auth.dto';
@ApiTags('AUTHENTICATION')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('validate_token')
  async validateToken(token: string) {
    try {
      const user = await this.authService.verifyToken(token);
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  @ApiOperation({ summary: 'Login User' })
  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Register User' })
  @Post('register')
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }
}
