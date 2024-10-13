import { UserEntity } from '../entity/user.entity';
import { UserDomain } from '../../domain/user.domain';
import { IUserMapper } from './user.mapper.interface';
export class UserMapper implements IUserMapper {
  toDomain(user: UserEntity): UserDomain {
    return UserDomain.create( user.name, user.email, user.password, user.id);
  }

  toEntity(user: UserDomain): Partial<UserEntity> {
    const props = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
    return props;
  }
}
