import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/domain/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Image {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the Image',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Admin',
    description: 'Name of the Image',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: () => [User],
    description: 'List of users associated with the image',
    isArray: true,
  })
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
