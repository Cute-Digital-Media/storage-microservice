import { Injectable } from '@nestjs/common';
import { UserCreateUseCase } from './app/use-cases/user.create.use-case';
import { UserCreateDto } from './app/dtos/user.create.dto';
import { UserDomain } from './domain/user.domain';
import { UserFindByEmailUseCase } from './app/use-cases/user.findByEmail.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly createUseCase: UserCreateUseCase,
    private readonly findByEmailUseCase: UserFindByEmailUseCase,
  ) {}
  async create(user: UserCreateDto): Promise<UserDomain> {
    return await this.createUseCase.execute(user);
  }
  async findByEmail(email: string): Promise<UserDomain> {
    return await this.findByEmailUseCase.execute(email);
  }
}
