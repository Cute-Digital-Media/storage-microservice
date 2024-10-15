import { ImageTypesEnum } from '../../domain/image-types.enum';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'images' })
export class ImageEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column('enum', { enum: ImageTypesEnum })
  type: ImageTypesEnum;
  @Column('varchar')
  url: string;
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;
}
