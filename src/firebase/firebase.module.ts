import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import * as admin from 'firebase-admin';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseController],
  providers: [
    FirebaseService,
    {
      provide: 'FIREBASE_APP',
      useFactory: (configService: ConfigService) => {
        const firebaseConfig = {
          type: configService.get('TYPE'),
          projectId: configService.get('PROJECT_ID'),
          privateKeyId: configService.get('PRIVATE_KEY_ID'),
          privateKey: configService.get('PRIVATE_KEY')?.replace(/\\n/g, '\n'),
          clientEmail: configService.get('CLIENT_EMAIL'),
          clientId: configService.get('CLIENT_ID'),
          authUri: configService.get('AUTH_URI'),
          tokenUri: configService.get('TOKEN_URI'),
          authProviderX509CertUrl: configService.get(
            'AUTH_PROVIDER_X509_CERT_URL',
          ),
          clientX509CertUrl: configService.get('CLIENT_X509_CERT_URL'),
        };

        const storageBucket = configService.get('FIREBASE_STORAGE_BUCKET');

        if (!storageBucket) {
          throw new Error(
            'FIREBASE_STORAGE_BUCKET is not defined in the environment variables',
          );
        }

        return admin.initializeApp({
          credential: admin.credential.cert(
            firebaseConfig as admin.ServiceAccount,
          ),
          storageBucket: storageBucket,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FirebaseService, 'FIREBASE_APP'],
})
export class FirebaseModule {}
