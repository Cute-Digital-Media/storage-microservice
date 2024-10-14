import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './domain/role.enity';
import { RolesService } from './application/roles.service';
import { RoleController } from './insfractuture/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesService],
  controllers: [RoleController],
  exports: [RolesService],
})
export class RolesModule {}
