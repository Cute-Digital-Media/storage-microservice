import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/domain/role.enity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  username: string;

  @Column()
  @ApiProperty({
    description: 'Password of the user',
    example: 'TotiSaltarin',
  })
  password: string;

  @Column()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ManyToOne(() => Role, (role) => role.users)
  @ApiProperty({
    description: 'Role assigned to the user',
    type: () => Role,
  })
  role: Role;
}
