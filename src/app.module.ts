import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import { ImagesModule } from './modules/images/images.module';
import { TypeormModule } from './infrastructure/typeorm/typeorm.module';
import { config } from './config/envs';

@Module({
  imports: [
    ImagesModule,
    TypeormModule,
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
    }),
  ],
})
export class AppModule {}
