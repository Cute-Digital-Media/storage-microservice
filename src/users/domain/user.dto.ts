import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  Matches,
  IsUUID,
} from 'class-validator';
import { UserEntity } from './user.entity';

type UserWithout = Omit<UserEntity, 'id' | 'role'>;

export class CreateUserDto implements UserWithout {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'TotiSaltarin',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*\W)/, {
    message: 'Password must contain at least one special character',
  })
  @IsNotEmpty()
  password: string;

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

  @ApiProperty({
    description: 'Unique identifier for the tenant',
    example: 'a3e95e9c-72be-4d89-a032-abc123def456',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
