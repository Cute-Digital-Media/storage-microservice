import { Module } from '@nestjs/common';

import { FirebaseConfig } from '../../infrastructure/firebase/firebase.service';
import { StorageService } from './storage.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FirebaseConfig, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
