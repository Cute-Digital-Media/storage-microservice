import { flatten } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RoleEntity } from 'src/roles/domain/role.enity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity({ name: 'user' })
@Unique(['username', 'email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  username: string;

  @Column({ nullable: false })
  @Exclude()
  @ApiProperty({
    description: 'Password of the user',
    example: 'TotiSaltarin',
  })
  password: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({
    description: 'Unique identifier for the tenant',
    example: 'a3e95e9c-72be-4d89-a032-abc123def456',
  })
  tenantId: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  @ApiProperty({
    description: 'RoleEntity assigned to the user',
    type: () => RoleEntity,
  })
  role: RoleEntity;
}
