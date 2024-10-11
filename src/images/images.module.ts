import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '../firebase/firebase.module';
import { ImageEntity } from './dto/entities/image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), FirebaseModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
