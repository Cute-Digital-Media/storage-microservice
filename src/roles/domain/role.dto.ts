import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Role } from 'src/roles/domain/role.enity';

type RoleWithout = Omit<
  Role,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedAt'
  | 'deletedBy'
  | 'version'
  | 'companyId'
  | 'users'
>;


export class CreateRoleDto implements RoleWithout{
  @ApiProperty({
    example: 'Admin',
    description: 'Name of the Role',
  })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
  name: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
