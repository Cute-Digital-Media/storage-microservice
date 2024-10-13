import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '../domain/user.entity';
import { CreateUserDto, UpdateUserDto } from '../domain/user.dto';
import { UsersService } from '../application/users.service';
import { RequestUser } from 'src/_shared/domain/request-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll(@Request() req: RequestUser): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne({ where: { id } });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.userService.update({ id }, updateUserDto);
    return this.userService.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete({ id });
  }
}
