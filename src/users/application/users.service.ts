import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/aplication/base-service.service';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { CreateUserDto } from '../domain/user.dto';
import { hashPassword } from 'src/_shared/domain/hash';
import { RolesService } from 'src/roles/application/roles.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {
    super(userRepository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    const role = await this.rolesService.findOne({
      where: { id: createUserDto.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const { roleId, ...createUse } = createUserDto;
    createUse['role'] = role;
    return this.save(createUse);
  }
}
