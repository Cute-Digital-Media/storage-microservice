import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import { ResponseMessage } from 'src/@common/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(user: LoginDto): Promise<any> {
    const existingUser = await this.usersService.findOne(user.username);

    if (existingUser.data && existingUser.data.password === user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = existingUser.data;
      return result;
    }

    return null;
  }

  async login(user: LoginDto) {
    try {
      const existingUser = await this.validateUser(user);
      if (!existingUser) return null;

      const payload = {
        existingUser: existingUser.username,
        id: existingUser.id,
      };

      return ResponseMessage({
        status: 201,
        data: {
          access_token: this.jwtService.sign(payload),
        },
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
