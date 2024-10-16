import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { randomUUID } from 'node:crypto';

import { ImageRepository } from '../../infra/image.repository';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { ImageTypesEnum } from '../../domain/image-types.enum';
import { Image } from '../../domain/image.domain';
import { StorageService } from '../../../storage/storage.service';
import { LoggerService } from '../../../../infrastructure/loggers/logger.service';

@Injectable()
export class UploadImage {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
    private readonly storageService: StorageService,
    private readonly logger: LoggerService,
  ) {}

  async execute({ file, userId }: UploadFileDto) {
    try {
      if (!file) {
        this.logger.warn('Upload attempt without a file');
        throw new BadRequestException('No file provided');
      }

      const allowedTypes = Object.values(ImageTypesEnum) as string[];
      this.logger.log(`Allowed image types: ${allowedTypes}`);
      this.logger.log(
        `Received file: ${file.originalname}, size: ${file.size}`,
      );

      if (!allowedTypes.includes(file.mimetype.split('/').pop())) {
        this.logger.warn(`File type not allowed: ${file.mimetype}`);
        throw new BadRequestException('File type not allowed');
      }

      if (file.size > 5 * 1024 * 1024) {
        this.logger.warn(
          `File exceeds maximum size: ${file.size} bytes, user: ${userId}`,
        );
        throw new BadRequestException(
          'The file exceeds the maximum allowed size',
        );
      }

      const fileName = `${file.originalname}-${Date.now()}-${randomUUID()}`;
      const thumbnailFileName = `thumbnail-${fileName}`;

      this.logger.log(`Uploading image to storage with filename: ${fileName}`);
      const url = await this.storageService.uploadImageToStorage(
        file.buffer,
        fileName,
        file.mimetype,
      );

      this.logger.log(`Generating thumbnail for file: ${fileName}`);
      const bufferThumbnail = await sharp(file.buffer).resize(200).toBuffer();

      this.logger.log(`Uploading thumbnail to storage: ${thumbnailFileName}`);
      const thumbnailUrl = await this.storageService.uploadImageToStorage(
        bufferThumbnail,
        thumbnailFileName,
        file.mimetype,
      );

      const image = new Image({
        url,
        thumbnailUrl,
        thumbnailFileName,
        size: file.size,
        uploaderByUserId: userId,
        fileName,
        mimeType: file.mimetype,
      });

      this.logger.log(`Saving image record to database, user: ${userId}`);
      return await this.repository.save(image);
    } catch (error) {
      this.logger.error(`Failed to upload image, error: ${error.message}`);
      throw error;
    }
  }
}
