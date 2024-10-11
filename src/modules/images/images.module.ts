import { Module } from '@nestjs/common';
import { ImagesController } from './controller/images.controller';
import { ImagesService } from './services/images.service';
import { FirebaseConfig } from 'src/shared/context/firebase.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entites/image.entity';

@Module({
  controllers: [ImagesController],
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService, FirebaseConfig],
})
export class ImagesModule {}
