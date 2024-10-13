import { UserRepository } from '../../infra/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { UserDomain } from '../../domain/user.domain';

@Injectable()
export class UserFindByEmailUseCase {
  constructor(private readonly repository: UserRepository) {}
  async execute(email: string): Promise<UserDomain> {
    try {
      return await this.repository.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }
}
