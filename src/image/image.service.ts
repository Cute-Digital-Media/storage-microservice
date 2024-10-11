import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject('FIREBASE_APP') private firebaseApp: admin.app.App,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    tenant: string,
    userId: string,
    folderName: string,
    imageId: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const bucket = this.firebaseApp.storage().bucket();
    const fileName = file.filename;
    const filePath = file.path;
    const destination = `${tenant}/${userId}/${folderName}/${fileName}`;

    try {
      const [uploadedFile] = await bucket.upload(filePath, {
        destination: destination,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            imageId: imageId,
            originalName: file.originalname,
            tenant: tenant,
            userId: userId,
            folderName: folderName,
          },
        },
      });

      await uploadedFile.makePublic();
      const publicUrl = uploadedFile.publicUrl();
      fs.unlinkSync(filePath);

      return `File uploaded successfully: ${publicUrl}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new BadRequestException('Failed to upload image');
    }
  }

  async getImage(
    term: string,
  ): Promise<{ url: string; name: string; id: string }> {
    const bucket = this.firebaseApp.storage().bucket();
    const [files] = await bucket.getFiles();

    const file = files.find(
      (f) =>
        f.name.includes(term) ||
        f.name === term ||
        f.metadata.metadata.imageId === term,
    );
    if (!file) {
      throw new BadRequestException('Image not found');
    }
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    });
    return {
      url: url,
      name: file.name.split('/').pop(),
      id: String(file.metadata.metadata.imageId),
    };
  }

  async getAllImages(
    tenant?: string,
    userId?: string,
    folderName?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    images: { name: string; id: string; url: string }[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const bucket = this.firebaseApp.storage().bucket();
    const [files] = await bucket.getFiles();
    let filteredFiles = files.filter((file) => {
      const metadata = file.metadata.metadata;
      return (
        (!tenant || metadata.tenant === tenant) &&
        (!userId || metadata.userId === userId) &&
        (!folderName || metadata.folderName === folderName)
      );
    });
    const total = filteredFiles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    filteredFiles = filteredFiles.slice(startIndex, endIndex);

    const images = await Promise.all(
      filteredFiles.map(async (file) => {
        const metadata = file.metadata.metadata || {};
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 15 * 60 * 1000,
        });
        return {
          name: file.name.split('/').pop(),
          id: String(metadata.imageId),
          url: url,
        };
      }),
    );

    return {
      images,
      total,
      page,
      totalPages,
    };
  }

  async deleteImage(imageId: string): Promise<void> {
    const bucket = this.firebaseApp.storage().bucket();
    const [files] = await bucket.getFiles();

    const file = files.find((f) => f.metadata.metadata?.imageId === imageId);
    if (!file) {
      throw new BadRequestException('Image Not Found');
    }

    await file.delete();
  }
}
