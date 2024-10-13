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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../domain/role.dto';
import { RolesService } from '../application/roles.service';
import { RoleEntity } from '../domain/role.enity';
import { PaginatedResponse } from 'src/_shared/domain/paginationResponse.dto';
import { PaginationDto } from 'src/_shared/domain/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSwagger } from 'src/_shared/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/swagger/http.swagger';

const controllerName = 'Roles';

@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(RoleEntity, controllerName))
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.roleService.save(createRoleDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(RoleEntity, controllerName))
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponse<RoleEntity>> {
    return this.roleService.findAll(undefined, pagination);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(RoleEntity, controllerName))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleEntity> {
    return this.roleService.findOne({ where: { id } });
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(RoleEntity, controllerName))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    await this.roleService.update({ id }, updateRoleDto);
    return this.roleService.findOne({ where: { id } });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(null, controllerName))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.roleService.delete({ id });
  }
}
