import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseConfig {
  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  }

  getStorage() {
    return admin.storage();
  }

  getBucket() {
    return admin.storage().bucket();
  }
}
