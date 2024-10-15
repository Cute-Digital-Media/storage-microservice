import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeormModule } from './modules/config/typeorm/typeorm.module';
import { EnvModule } from './modules/config/env/env.module';
import { ImagesModule } from './modules/images/images.module';
import { AuthModule } from './modules/config/auth/auth.module';
import { FirebaseModule } from './modules/config/firebase/firebase.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    UserModule,
    TypeormModule,
    EnvModule,
    ImagesModule,
    AuthModule,
    FirebaseModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 10
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
