import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { ImagesModule } from './modules/images/images.module';
import { Image } from './core/entities/image.entity';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Image],
        synchronize: true, // Solo para desarrollo
      }),
      inject: [ConfigService],
    }),
        
    // Módulos de la aplicación
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
