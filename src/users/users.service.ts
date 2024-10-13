import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserRole } from './enum/role.enum';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [
    {
      userId: 1,
      username: 'test_user',
      password: 'test_pass',
      tenant: 'tenant 1',
      role: UserRole.ADMIN,
    },
    {
      userId: 2,
      username: 'test_user2',
      password: 'test_pass2',
      tenant: 'tenant 1',
      role: UserRole.ADMIN,
    },
    {
      userId: 3,
      username: 'maria',
      password: 'guess',
      tenant: 'tenant 2',
      role: UserRole.GUEST,
    },
  ];

  async findOne(username: string): Promise<UserDto> {
    return this.users.find((user) => user.username === username);
  }

  async findOneById(id: number): Promise<UserDto> {
    return this.users.find((user) => user.userId === id);
  }

  async findAll(tenant: string): Promise<UserDto[]> {
    return this.users.filter((user) => user.tenant === tenant);
  }
}
