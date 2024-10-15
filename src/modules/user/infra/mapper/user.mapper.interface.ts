import { UserDomain } from '../../domain/user.domain';
import { UserEntity } from '../entity/user.entity';

export interface IUserMapper {
  toDomain(user: UserEntity): UserDomain;
  toEntity(user: UserDomain): Partial<UserEntity>;
  toView(user: UserDomain): Partial<UserEntity>;
}
