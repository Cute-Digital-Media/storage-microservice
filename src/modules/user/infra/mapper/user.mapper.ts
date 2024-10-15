import { UserEntity } from '../entity/user.entity';
import { UserDomain } from '../../domain/user.domain';
import { IUserMapper } from './user.mapper.interface';
export class UserMapper implements IUserMapper {
  toDomain(user: UserEntity): UserDomain {
    return UserDomain.create( user.name, user.email, user.password, user.id);
  }

  toEntity(user: UserDomain): Partial<UserEntity> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
  toView(user: UserDomain): Partial<UserEntity> {
    return{
      name: user.name,
      email: user.email,
    }
  }
}
