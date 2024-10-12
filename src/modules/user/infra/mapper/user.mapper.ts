import { UserEntity } from '../entity/user.entity';
import { UserDomain } from '../../domain/user.domain';
import { v4 as uuidv4 } from 'uuid';
import { IUserMapper } from './user.mapper.interface';
export class UserMapper implements IUserMapper {
  toDomain(user: UserEntity): UserDomain {
    return new UserDomain(user.id, user.name, user.email, user.password);;
  }

  toEntity(user: UserDomain): Partial<UserEntity> {
    const id = uuidv4();
    const props = {
      id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
    return props;
  }
}
