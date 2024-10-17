import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from 'nestjs-cache-manager-v6';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';
import { LoggerService } from './logs/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CacheModule.register({
      stores: [
        new Keyv({ store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }) }),
        new KeyvRedis(
          `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        ),
      ],
      isGlobal: true,
    }),
    AuthModule,
    ImagesModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
