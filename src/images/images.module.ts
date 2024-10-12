/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ImageController } from './images.controller';
import { ImagesService } from './services/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ImageTransformService } from './services/image-transform.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Image]), FirebaseModule],
    controllers: [ImageController],
    providers: [ImagesService, ImageTransformService, JwtAuthGuard],
})
export class ImagesModule { }
