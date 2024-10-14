import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/user.entity';
import { UsersService } from './application/users.service';
import { UserController } from './insfractuture/user.controller';
import { RolesService } from 'src/roles/application/roles.service';
import { RoleEntity } from 'src/roles/domain/role.enity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UsersService, RolesService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
