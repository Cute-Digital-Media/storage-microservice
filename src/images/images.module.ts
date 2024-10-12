import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ImagesService, JwtService],
  imports: [FirebaseModule],
  controllers: [ImagesController],
})
export class ImagesModule {}
