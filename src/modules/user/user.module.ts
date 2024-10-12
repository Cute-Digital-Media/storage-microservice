import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/entity/user.entity';
import { UserRepository } from './infra/repository/user.repository';
import { UserMapper } from './infra/mapper/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserMapper],
  exports: [UserRepository],
})
export class UserModule {}
