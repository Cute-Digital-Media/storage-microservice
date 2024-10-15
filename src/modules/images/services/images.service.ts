import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import * as sharp from 'sharp';

import { Image } from '../entites/image.entity';
import { FirebaseConfig } from '../../../shared/context/firebase.config';
import { PaginatedResult } from '../../../interface/pagination-result';
import { PaginationDTO } from '../../../shared/dtos/pagination.dto';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { UploadBullFileDto } from '../dtos/upload-bull-file.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private firebaseConfig: FirebaseConfig,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  private logger = new Logger(ImagesService.name);

  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly maxSize = 3 * 1024 * 1024; // 3MB
  private readonly expiresImage = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h after

  //upload
  async uploadImage({ file, userId }: UploadFileDto): Promise<Image> {
    //Validations
    this.validateFile(file);

    const fileName = this.generateFileName(file);

    const bufferThumbnail = await this.generateThumbnail(file);

    const url = await this.uploadImageToStorage(
      file.buffer,
      fileName,
      file.mimetype,
    );

    const thumbnailFileName = `thumbnail-${fileName}`;
    const thumbnailUrl = await this.uploadImageToStorage(
      bufferThumbnail,
      thumbnailFileName,
      file.mimetype,
    );

    const image = this.imageRepository.create({
      fileName,
      url,
      thumbnailUrl,
      thumbnailFileName,
      mimeType: file.mimetype,
      size: file.size,
      uploaderBy: userId,
    });

    // Clear cache after uploading
    await this.cacheManager.del(`images_*`);
    this.logger.log(`Image uploaded successfully by userId-${userId}`);
    return this.imageRepository.save(image);
  }

  async uploadBullImages({
    files,
    userId,
  }: UploadBullFileDto): Promise<Image[]> {
    // Validations
    files.forEach((file) => this.validateFile(file));

    // Process each file
    const uploadPromises = files.map(async (file) => {
      const fileName = this.generateFileName(file);

      const bufferThumbnail = await this.generateThumbnail(file);

      const url = await this.uploadImageToStorage(
        file.buffer,
        fileName,
        file.mimetype,
      );

      const thumbnailFileName = `thumbnail-${fileName}`;
      const thumbnailUrl = await this.uploadImageToStorage(
        bufferThumbnail,
        thumbnailFileName,
        file.mimetype,
      );

      const image = this.imageRepository.create({
        fileName,
        url,
        thumbnailUrl,
        thumbnailFileName,
        mimeType: file.mimetype,
        size: file.size,
        uploaderBy: userId,
      });

      this.logger.log(
        ` ${files.length}} Images uploaded successfully by userId-${userId}`,
      );
      return this.imageRepository.save(image);
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadPromises);

    // Clear cache after uploading
    await this.cacheManager.del(`images_*`);

    return images;
  }

  //gets
  async getAllImage({ page = 1, limit = 10 }: PaginationDTO) {
    const key = `images_${page}_${limit}`;

    const cache = await this.cacheManager.get<PaginatedResult<Image>>(key);

    if (cache) return cache;

    const [images, count] = await this.imageRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination: PaginatedResult<Image> = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
      items: images,
    };
    await this.cacheManager.set(key, pagination);

    return pagination;
  }

  async getImageById(id: string): Promise<Image> {
    const key = `image_${id}`;

    const cache = await this.cacheManager.get<Image>(key);

    if (cache) return cache;

    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) throw new NotFoundException('Image not found');
    await this.cacheManager.set(key, image);

    return image;
  }

  //deleted

  async deleteImage(id: string): Promise<void> {
    const image = await this.getImageById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    //deleted to storage
    await this.deletedImageToStorage(image.fileName);
    await this.deletedImageToStorage(image.thumbnailFileName);

    //deleted to cache
    await this.cacheManager.del(`images_*`);

    //deleted to database
    await this.imageRepository.remove(image);
    return;
  }

  //helpers
  generateFileName(file: Express.Multer.File): string {
    return `${file.originalname}-${Date.now()}-${randomUUID()}`;
  }
  //Abstracts the image deleted logic to Firebase for better separation of concerns and maintainable architecture.
  async deletedImageToStorage(fileName: string) {
    try {
      const bucket = this.firebaseConfig.getBucket();
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      throw new BadRequestException('Error uploading image to Firebase');
    }
  }

  //Abstracts the image upload logic to Firebase for better separation of concerns and maintainable architecture.
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

      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: this.expiresImage,
      });

      return url;
    } catch (error) {
      throw new BadRequestException('Error uploading image to Firebase');
    }
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        'The file exceeds the maximum allowed size',
      );
    }
  }

  async generateThumbnail(file: Express.Multer.File): Promise<Buffer> {
    // In a real use case, you might want to adjust the dimensions
    return await sharp(file.buffer).resize(200).toBuffer();
  }
}
