import { UserRepository } from '../../../../user/infra/repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/user.login.dto';
import { JwtInterface } from '../../payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../../user/user.service';
import { AuthResponse } from './user.register.use-case';
import { UserMapper } from '../../../../user/infra/mapper/user.mapper';

@Injectable()
export class UserLoginUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    public readonly userMapper: UserMapper,
  ) {}
  async execute(login: LoginDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.findByEmail(login.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (!(await user.validatePassword(login.password))) {
        throw new UnauthorizedException('Invalid password');
      }
      const token = this.getJwtToken({ email: user.email });
      return new AuthResponse(user, token, this.userMapper);
    } catch (error) {
      throw error;
    }
  }

  getJwtToken(payload: JwtInterface) {
    return this.jwtService.sign(payload);
  }
}
