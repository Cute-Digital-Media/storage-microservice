import { Injectable } from '@nestjs/common';

import { LoginDto } from './app/dtos/user.login.dto';
import { UserLoginUseCase } from './app/use-cases/user.login.use-case';
import { UserCreateDto } from '../../user/app/dtos/user.create.dto';
import { UserRegisterUseCase } from './app/use-cases/user.register.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly userLoginUseCase: UserLoginUseCase,
    private readonly userRegisterUserCase: UserRegisterUseCase,
  ) {}
  async login(login: LoginDto) {
    return await this.userLoginUseCase.execute(login);
  }
  async register(userCreateDto: UserCreateDto) {
    return await this.userRegisterUserCase.execute(userCreateDto)
  }
}
