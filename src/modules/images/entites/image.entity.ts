import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  //in case use real created relation with new model 1:m
  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  thumbnailFileName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  //in case use real created relation with model user
  @Column({ nullable: true })
  uploaderBy: string;
}
