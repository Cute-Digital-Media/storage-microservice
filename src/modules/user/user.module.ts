import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/entity/user.entity';
import { UserRepository } from './infra/repository/user.repository';
import { UserMapper } from './infra/mapper/user.mapper';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserCreateUseCase } from './app/use-cases/user.create.use-case';
import { UserFindByEmailUseCase } from './app/use-cases/user.findByEmail.use-case';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule],
  providers: [
    UserRepository,
    UserMapper,
    UserService,
    UserCreateUseCase,
    UserFindByEmailUseCase,
  ],
  exports: [
    UserRepository,
    UserMapper,
    UserService,
    UserCreateUseCase,
    UserFindByEmailUseCase
  ],
  controllers: [UserController],
})
export class UserModule {}
