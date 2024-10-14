import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from 'src/_shared/domain/hash';
import { Payload } from 'src/_shared/domain/request-user';
import { UsersService } from 'src/users/application/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    let user;
    try {
      user = await this.usersService.findOne({ where: { username } });
    } catch (e) {
      if (e.message === 'Entity not found') throw new UnauthorizedException();
      throw e;
    }

    if (!await validatePassword(pass, user.password)) {
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
