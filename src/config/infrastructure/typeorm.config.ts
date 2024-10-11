import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { Image } from '../../modules/images/entites/image.entity';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Image],
  migrations: ['../database/migrations/*{.ts,.js}'],
  //autoLoadEntities: true,
  synchronize: !!process.env.DB_SYNCHRONIZE,
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
