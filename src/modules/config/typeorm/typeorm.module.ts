import { Module } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';

export const getTypeOrmModuleOptions = (
  config: EnvService,
): TypeOrmModuleOptions =>
  ({
    type: 'postgres',
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    database: config.getDatabaseName(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: false,
    schema: 'public',
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    migrationsRun: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/modules/config/database/migrations',
    },
    migrationsTableName: 'migrations',
  }) as TypeOrmModuleOptions;
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeormModule {}
