import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { File } from './file.entity';
import { TypeThumbnail } from '../../enum/type-thumbnail.enum';

@Entity('thumbnail')
export class Thumbnail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: TypeThumbnail,
    nullable: false,
    default: TypeThumbnail.SMALL,
  })
  type: TypeThumbnail;

  @ManyToOne(
    () => File,
    file => file.thumbnails,
    { nullable: false }
  )
  file: File;
}
