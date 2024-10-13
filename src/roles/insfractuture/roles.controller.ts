import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../domain/role.dto';
import { RolesService } from '../application/roles.service';
import { Role } from '../domain/role.enity';
import { PaginatedResponse } from 'src/_shared/domain/paginationResponse.dto';
import { PaginationDto } from 'src/_shared/domain/pagination.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.save(createRoleDto);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<PaginatedResponse<Role>> {
    return this.roleService.findAll(undefined, pagination);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roleService.findOne({ where: { id } });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    await this.roleService.update({ id }, updateRoleDto);
    return this.roleService.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.roleService.delete({ id });
  }
}
