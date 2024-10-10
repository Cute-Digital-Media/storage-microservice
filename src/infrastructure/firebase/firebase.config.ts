import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseConfig {
  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      projectId: this.configService.get<string>('firebase.projectId'),
      privateKey: this.configService.get<string>('firebase.privateKey').replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('firebase.clientEmail'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  }

  getStorage() {
    return admin.storage();
  }
}
