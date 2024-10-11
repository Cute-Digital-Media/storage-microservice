import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../technical-test-storage-ms-firebase-adminsdk-xzswb-d1fe5cc074.json'; // Path to the downloaded JSON

import { FileModule } from './file/file.module';
import { ConfigDB } from './db/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    // TypeOrmConfig
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return ConfigDB.getTypeOrmOptions(configService);
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),

    FileModule,
  ],
})
export class AppModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // This comes from your .env file
    });
  }
}
