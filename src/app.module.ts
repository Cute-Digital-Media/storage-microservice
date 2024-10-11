import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, envFilePath: '.env' }),
    ImageModule,
    FirebaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
