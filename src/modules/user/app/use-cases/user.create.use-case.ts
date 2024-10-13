import { UserRepository } from '../../infra/repository/user.repository';
import { UserDomain } from '../../domain/user.domain';
import { UserCreateDto } from '../dtos/user.create.dto';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserCreateUseCase {
  constructor(private readonly repository: UserRepository) {}
  async execute(user: UserCreateDto): Promise<void> {
    user.password = await UserDomain.hashPassword(user.password);
    const userDomain = UserDomain.create(user.name, user.email, user.password);
    try {
      await this.repository.save(userDomain);
    } catch (error) {
      throw error;
    }
  }
}
