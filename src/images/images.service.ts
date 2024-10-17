import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService implements OnModuleInit {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: privateKey,
      }),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    ownerId: number,
  ): Promise<Image> {
    const bucket = admin.storage().bucket();

    const filename = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(filename);
    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    const thumbnailBuffer = await sharp(file.buffer)
      .resize(200, 200, { fit: 'inside' })
      .toBuffer();
    const thumbnailFilename = `thumbnail-${filename}`;
    const thumbnailUpload = bucket.file(thumbnailFilename);
    await thumbnailUpload.save(thumbnailBuffer, {
      metadata: { contentType: file.mimetype },
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    const [thumbnailUrl] = await thumbnailUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    const image = this.imagesRepository.create({
      filename,
      url,
      thumbnailUrl,
      ownerId,
    });

    return this.imagesRepository.save(image);
  }

  async getImage(id: string): Promise<Image> {
    const image = await this.imagesRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async getAllImages(): Promise<Image[]> {
    return this.imagesRepository.find();
  }

  async updateImage(id: string, file: Express.Multer.File): Promise<Image> {
    const existingImage = await this.getImage(id);

    const bucket = admin.storage().bucket();

    await bucket.file(existingImage.filename).delete();
    await bucket.file(`thumbnail-${existingImage.filename}`).delete();

    const filename = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(filename);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    const thumbnailBuffer = await sharp(file.buffer)
      .resize(200, 200, { fit: 'inside' })
      .toBuffer();

    const thumbnailFilename = `thumbnail-${filename}`;

    const thumbnailUpload = bucket.file(thumbnailFilename);

    await thumbnailUpload.save(thumbnailBuffer, {
      metadata: { contentType: file.mimetype },
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    const [thumbnailUrl] = await thumbnailUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    existingImage.filename = filename;
    existingImage.url = url;
    existingImage.thumbnailUrl = thumbnailUrl;

    return this.imagesRepository.save(existingImage);
  }

  async deleteImage(id: string): Promise<void> {
    const image = await this.getImage(id);
    const bucket = admin.storage().bucket();

    await bucket.file(image.filename).delete();
    await bucket.file(`thumbnail-${image.filename}`).delete();

    await this.imagesRepository.remove(image);
  }
}
