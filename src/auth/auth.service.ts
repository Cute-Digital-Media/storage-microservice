import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './types/auth.response.type';
import { LoginInput, SignupInput } from './dto/inputs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);

    const token = this.getJwtToken(user.id, user.tenantId, user.roles[0]);
    return { token, user };
  }

  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const token = this.getJwtToken(user.id, user.tenantId, user.roles[0]);

    return {
      token,
      user,
    };
  }

  async validateUserById(userId: string): Promise<User> {
    const user = await this.usersService.findOneById(userId);
    if (!user.isActive) {
      throw new UnauthorizedException(`User ${user.fullName} is inactive`);
    }

    delete user.password;
    return user;
  }

  async validateToken(token: string) {
    const decodeData: JwtPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return await this.validateUserById(decodeData.sub);
  }

  async revalidateToken(token: string): Promise<AuthResponse> {
    const user = await this.validateToken(token);
    const newToken = this.getJwtToken(user.id, user.tenantId, user.roles[0]);

    return { token: newToken, user };
  }
  private getJwtToken(userId: string, tenant: string, role: string): string {
    return this.jwtService.sign({ id: userId, tenant: tenant, role: role });
  }
}
