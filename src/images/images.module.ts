import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '../firebase/firebase.module';
import { RedisCacheService } from '../redis/redis-cache.service';
import { ImageEntity } from './dto/entities/image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    FirebaseModule,
    HttpModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, RedisCacheService],
})
export class ImagesModule {}
