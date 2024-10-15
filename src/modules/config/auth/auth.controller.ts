import { Body, Controller, Post} from '@nestjs/common';
import { LoginDto } from './app/dtos/user.login.dto';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../../user/app/dtos/user.create.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Post('login') login(@Body() login: LoginDto): Promise<{ token: string }> {
    return this.authService.login(login);
  }
  @Post('register') register(@Body() userCreteDto: UserCreateDto){
    return this.authService.register(userCreteDto);
  }
}
