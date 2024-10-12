import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/_shared/domain/request-user';
import { UsersService } from 'src/users/application/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne({ where: { username } });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload: Payload = {
      userId: user.id,
      tenantId: user.tenantId,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
