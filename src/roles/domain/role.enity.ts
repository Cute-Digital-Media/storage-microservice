import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/domain/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the Role',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Admin',
    description: 'Name of the Role',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    type: () => [User],
    description: 'List of users associated with the role',
    isArray: true,
  })
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
