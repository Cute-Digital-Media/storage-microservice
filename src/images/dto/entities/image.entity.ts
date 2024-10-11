import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  uploadDate?: Date;

  @Column({ default: 0 })
  orininalSize: number;

  @Column({ default: 0 })
  compressedSize: number;

  @Column()
  url: string;
}
