import { UserDomainRepository } from '../../domain/user.domain.repository';
import { UserDomain } from '../../domain/user.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../mapper/user.mapper';

export class UserRepository implements UserDomainRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly mapper: UserMapper,
  ) {}
  async findByEmail(email: string): Promise<UserDomain> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return this.mapper.toDomain(user);
  }
  async save(user: UserDomain): Promise<void> {
    await this.repository.save(this.mapper.toEntity(user));
  }
}
