import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { v4 as UUID } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor() {
    const serviceAccount = path.resolve(__dirname, '../../frbsdk.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'microservicetest-a52dc.appspot.com',
    });
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Is your file a image?');

    const bucket = admin.storage().bucket();
    const fileName = Date.now() + '_' + file.originalname;

    const fileUploaded = bucket.file(fileName);

    const firebaseStorageDownloadTokens = UUID();

    const stream = fileUploaded.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens,
      },
    });

    const img_url =
      'https://firebasestorage.googleapis.com/v0/b/microservicetest-a52dc.appspot.com/o/' +
      encodeURIComponent(fileUploaded.name) +
      '?alt=media&token=' +
      firebaseStorageDownloadTokens;

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        this.logger.error('Error uploading file:', error);
        reject(error);
      });

      stream.on('finish', () => {
        this.logger.log(`File uploaded successfuly: ${fileName}`);
        resolve(img_url);
      });

      stream.end(file.buffer);
    });
  }
}
