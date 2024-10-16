import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from '../../config/envs';

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions =>
  ({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: config.DB_SYNCHRONIZE,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  }) as TypeOrmModuleOptions;

export default new DataSource(getTypeOrmModuleOptions() as DataSourceOptions);
