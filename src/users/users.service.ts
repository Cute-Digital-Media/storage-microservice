import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseData> {
    try {
      const { username, password } = createUserDto;

      const existingUser = await this.findOne(username);
      if (existingUser.data) {
        return ResponseMessage({
          status: 400,
          message: 'Username already existing.',
        });
      }
      const user = await this.usersRepository.create({
        username,
        password,
      });

      this.usersRepository.save(user);

      return ResponseMessage({
        status: 201,
        data: user,
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async findOne(username: string): Promise<ResponseData> {
    try {
      const user = await this.usersRepository.findOneBy({ username });
      if (!user) {
        return ResponseMessage({
          status: 400,
          message: 'Username does not exist.',
        });
      }
      return ResponseMessage({
        data: user,
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
