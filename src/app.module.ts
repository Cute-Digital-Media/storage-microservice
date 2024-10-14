import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeormModule } from './modules/config/typeorm/typeorm.module';
import { EnvModule } from './modules/config/env/env.module';
import { ImagesModule } from './modules/images/images.module';
import { AuthModule } from './modules/config/auth/auth.module';
import { FirebaseModule } from './modules/config/firebase/firebase.module';

@Module({
  imports: [
    UserModule,
    TypeormModule,
    EnvModule,
    ImagesModule,
    AuthModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
