import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('image')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  /*
   * Si se desea manejar múltiples thumbnails con diferentes resoluciones,
   * se puede crear una relación OneToMany entre la entidad `ImageEntity`
   * y una entidad `ThumbnailEntity`. Esto permitiría almacenar varias
   * versiones del thumbnail con diferentes tamaños/resoluciones para
   * cada imagen principal.*/
  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  thumbnailFileName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  /* En un caso de uso real, la columna `uploaderByUserId`
   * debería ser una relación ManyToOne con la entidad `User` para
   * asociar cada imagen con el usuario que la subió. */

  @Column({ nullable: true })
  uploaderByUserId: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
