import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column('varchar', { length: 100 })
  name: string;
  @Column('varchar', { length: 100, unique: true })
  email: string;
  @Column('varchar', { length: 100 })
  password: string;
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

}
