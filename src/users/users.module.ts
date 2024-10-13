import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UsersService } from './application/users.service';
import { UserController } from './insfractuture/user.controller';
import { RolesService } from 'src/roles/application/roles.service';
import { Role } from 'src/roles/domain/role.enity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, RolesService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UsersModule {}
