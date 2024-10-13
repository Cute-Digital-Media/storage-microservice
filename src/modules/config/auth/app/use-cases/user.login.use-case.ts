import { UserRepository } from '../../../../user/infra/repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/user.login.dto';
import { JwtInterface } from '../../payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../../user/user.service';
@Injectable()
export class UserLoginUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(login: LoginDto): Promise<{ token: string }> {
    try {
      const user = await this.userService.findByEmail(login.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (!(await user.validatePassword(login.password))) {
        throw new UnauthorizedException('Invalid password');
      }
      return {
        token: this.getJwtToken({ email: login.email }),
      };
    } catch (error) {
      throw error;
    }
  }

  getJwtToken(payload: JwtInterface) {
    return this.jwtService.sign(payload);
  }
}
