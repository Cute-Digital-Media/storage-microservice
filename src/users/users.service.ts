import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SignupInput } from 'src/auth/dto/inputs';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: await bcrypt.hash(signupInput.password, 10),
        tenantId: randomUUID(),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  private handleDbError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if (error.code === 'error-0001') {
      throw new NotFoundException(error.detail);
    }

    throw new InternalServerErrorException('Please contact the administrator');
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDbError({
        code: 'error-0001',
        detail: `User with email ${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDbError({
        code: 'error-0001',
        detail: `User with id ${id} not found`,
      });
    }
  }
}
