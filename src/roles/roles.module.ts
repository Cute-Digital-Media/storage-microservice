import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/role.enity';
import { RolesService } from './application/roles.service';
import { RoleController } from './insfractuture/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService],
  controllers: [RoleController],
})
export class RolesModule {}
