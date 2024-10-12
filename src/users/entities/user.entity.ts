import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  tenantId: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;
}
