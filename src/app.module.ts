import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { configSchema } from './config/config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from './modules/images/images.module';
import { JwtMockMiddleware } from './shared/middleware';
import { redisStore } from 'cache-manager-redis-yet';
import typeormConfig from './config/infrastructure/typeorm.config';
import { CorrelationIdMiddleware } from './shared/middleware/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        ttl: configService.get('REDIS_TTl'),
      }),
      inject: [ConfigService],
    }),
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMockMiddleware, CorrelationIdMiddleware).forRoutes('*');
  }
}
