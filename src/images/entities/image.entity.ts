import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FirebaseImage } from './firebase-image.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  title: string;
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];
  @Column({ type: 'text', nullable: true })
  description: string;
  @OneToOne(
    () => FirebaseImage,
    (firebaseImage) => firebaseImage.firebaseImage,
    {
      cascade: true,
      eager: true,
    },
  )
  firebaseImage?: FirebaseImage;
}
