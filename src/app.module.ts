import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import enviromentValidations from './config/enviroment.validations';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImageModule } from './image/image.module';
import { FirebaseModule } from './firebase/firebase.module';
import jwtConfig from './auth/config/jwt.config';
const ENV = process.env.NODE_ENV
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    load: [appConfig, databaseConfig],
    validationSchema: enviromentValidations
  }), ConfigModule.forFeature(jwtConfig),
  JwtModule.registerAsync(jwtConfig.asProvider()),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      synchronize: configService.get('database.synchronize'),
      autoLoadEntities: configService.get('database.autoLoadEntities'),
      database: configService.get('database.name'),
      port: configService.get('database.port'),
      username: configService.get('database.user'),
      password: configService.get('database.password'),
      host: configService.get('database.host'),

    }),
  }), AuthModule, UsersModule, ImageModule, FirebaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
