import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { FirebaseConfig } from '../../infrastructure/firebase/firebase.service';

@Injectable()
export class StorageService {
  constructor(private readonly firebaseConfig: FirebaseConfig) {}

  private logger = new Logger(StorageService.name);

  async uploadImageToStorage(
    buffer: Buffer,
    fileName: string,
    mimetype: string,
  ) {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(buffer, {
        metadata: {
          contentType: mimetype,
        },
      });

      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return publicUrl;
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('Error uploading image to storage');
    }
  }

  async deletedImageToStorage(fileName: string) {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('Error deleted image to storage');
    }
  }
}
