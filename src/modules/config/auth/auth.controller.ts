import { Body, Controller, Post} from '@nestjs/common';
import { LoginDto } from './app/dtos/user.login.dto';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../../user/app/dtos/user.create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from './app/use-cases/user.register.use-case';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Post('login')
  @ApiResponse({ status: 201, type: AuthResponse })
  login(@Body() login: LoginDto): Promise<{ token: string }> {
    return this.authService.login(login);
  }
  @Post('register')
  @ApiResponse({ status: 201, type: AuthResponse })
  register(@Body() userCreteDto: UserCreateDto){
    return this.authService.register(userCreteDto);
  }
}
