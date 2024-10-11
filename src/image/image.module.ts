import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [FirebaseModule, AuthModule],
})
export class ImageModule {}
