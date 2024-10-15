import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ImagesModule } from './images/images.module';
import { RedisCacheModule } from './redis/redis-cache.module';
import { RedisCacheService } from './redis/redis-cache.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp({ format: 'DD/MM/YYYY, hh:mm:ss' }),
            format.printf((info) => {
              return `[${info.timestamp}]: ${info.message}`;
            }),
          ),
        }),
        new transports.File({
          filename: `logs/images.log`,
          format: format.combine(
            format.timestamp({ format: 'DD/MM/YYYY, hh:mm:ss' }),
            format.printf((info) => {
              return `[${info.timestamp}]: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
    FirebaseModule,
    ImagesModule,
    AuthModule,
    UsersModule,
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisCacheService],
})
export class AppModule {}
