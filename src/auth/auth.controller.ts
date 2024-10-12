import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types/auth.response.type';
import { Auth } from './decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpInput: SignupInput): Promise<AuthResponse> {
    return await this.authService.signUp(signUpInput);
  }

  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return await this.authService.login(loginInput);
  }

  @Auth(Role.USER)
  @Get('verify')
  async verify(@ActiveUser() user: UserActiveInterface): Promise<AuthResponse> {
    console.log(user);
    return new AuthResponse();
  }
}
