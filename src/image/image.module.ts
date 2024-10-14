import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './providers/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '../firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Image } from './image.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [TypeOrmModule.forFeature([Image]), FirebaseModule, ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider()), AuthModule, UsersModule]
})
export class ImageModule { }
