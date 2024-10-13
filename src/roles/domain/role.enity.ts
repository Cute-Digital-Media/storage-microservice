import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/domain/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
@Entity({ name: 'role' })
export class RoleEntity {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the RoleEntity',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Admin',
    description: 'Name of the RoleEntity',
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({
    type: () => [UserEntity],
    description: 'List of users associated with the role',
    isArray: true,
  })
  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
