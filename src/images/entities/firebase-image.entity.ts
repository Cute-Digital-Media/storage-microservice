import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class FirebaseImage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text')
  url: string;
  @OneToOne(() => Image, (image) => image.firebaseImage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  firebaseImage: Image;
}
