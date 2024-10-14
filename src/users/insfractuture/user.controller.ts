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
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserEntity } from '../domain/user.entity';
import { CreateUserDto, UpdateUserDto } from '../domain/user.dto';
import { UsersService } from '../application/users.service';
import { PaginationDto } from 'src/_shared/domain/pagination.dto';
import { PaginatedResponse } from 'src/_shared/domain/paginationResponse.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSwagger } from 'src/_shared/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/swagger/http.swagger';

const controllerName = 'Users';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(UserEntity, controllerName))
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(UserEntity, controllerName))
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponse<UserEntity>> {
    return this.userService.findAll(undefined, pagination);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(UserEntity, controllerName))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findOne({ where: { id } });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(UserEntity, controllerName))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    await this.userService.update({ id }, updateUserDto);
    return this.userService.findOne({ where: { id } });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(null, controllerName))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete({ id });
  }
}
