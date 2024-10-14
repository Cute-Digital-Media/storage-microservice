import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/aplication/base-service.service';
import { Repository } from 'typeorm';
import { RoleEntity } from '../domain/role.enity';

@Injectable()
export class RolesService extends BaseService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(roleRepository);
  }
}
