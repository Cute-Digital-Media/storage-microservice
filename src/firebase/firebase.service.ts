import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { ImageDto } from '../images/dto/image.dto';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  async uploadImage(imageData: ImageDto): Promise<string> {
    const uuid = uuidv4();
    const filePath = `${imageData.folderName}/${imageData.originalFileName}-${uuid}`;
    const bucket = this.firebaseApp
      .storage()
      .bucket(this.firebaseApp.options.storageBucket);
    const fileUpload = bucket.file(filePath);
    const processedBuffer: Buffer = imageData.buffer;

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: 'image/webp',
      },
    });

    blobStream.end(processedBuffer);

    await new Promise<void>((resolve, reject) => {
      blobStream.on('finish', resolve);
      blobStream.on('error', reject);
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return url;
  }
}
