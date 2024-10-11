import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Thumbnail } from './thumbnail.entity';

@Entity('file') // Table name
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  size: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedAt: Date;

  @Column({ nullable: true })
  uploadedBy?: string;

  @OneToMany(
    () => Thumbnail,
    thumbnail => thumbnail.file,
    { cascade: ["insert"], eager: true },
  )
  thumbnails: Thumbnail[];
}
