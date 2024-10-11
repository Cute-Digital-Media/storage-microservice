import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { envs } from '../@config/envs';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  constructor() {
    this.initializeFirebase();
  }

  private async initializeFirebase() {
    const credentialsPath = envs.credentials;

    const serviceAccount = (await import(credentialsPath)) as ServiceAccount;

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: envs.bucket_name,
      });
    }
  }

  get bucket() {
    return admin.storage().bucket();
  }
}
