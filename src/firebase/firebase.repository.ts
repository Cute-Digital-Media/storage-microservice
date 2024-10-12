import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  private readonly storage: admin.storage.Storage;

  constructor(@Inject('FIREBASE_APP') private readonly firebaseApp: app.App) {
    this.storage = firebaseApp.storage();
  }

  get storageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
