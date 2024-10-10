import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../../core/entities/image.entity';
import { ImagesController } from './controllers/images.controller';
import { ImagesService } from './services/images.service';
//import { ImagesRepository } from './repositories/images.repository';
import { FirebaseConfig } from 'src/infrastructure/firebase/firebase.config';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [ImagesService, FirebaseConfig],
})
export class ImagesModule {}

