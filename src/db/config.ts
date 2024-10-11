import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export class ConfigDB {

  static getTypeOrmOptions(configService: ConfigService): TypeOrmModuleOptions {
    
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: ["dist/**/*.entity{ .ts,.js}"],
      migrations: ["dist/src/db/migrations/*{.ts,.js}"],
      autoLoadEntities: false,
      synchronize: false,
    }
  }

}
