import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsInt } from 'class-validator';
import { User } from './user.entity';

type UserWithout = Omit<
  User,
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
  | 'role'
>;


export class CreateUserDto implements UserWithout {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'ID of the role assigned to the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  roleId: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
