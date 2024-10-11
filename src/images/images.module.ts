import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/@config/envs';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.secret_key,
    }),
    FirebaseModule,
    TypeOrmModule.forFeature([Image, User]),
  ],
})
export class ImagesModule {}
