import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ImageRepository } from '../../infra/image.repository';
import { StorageService } from '../../../storage/storage.service';
import { LoggerService } from '../../../../infrastructure/loggers/logger.service';

@Injectable()
export class DeletedImage {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
    private readonly storageService: StorageService,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string) {
    try {
      this.logger.log(`Attempting to delete image with ID: ${id}`);

      const image = await this.repository.finById(id);
      if (!image) {
        this.logger.warn(`Image with ID: ${id} not found`);
        throw new NotFoundException('Image not found');
      }

      this.logger.log(`Found image with ID: ${id}, proceeding to delete`);

      await this.storageService.deletedImageToStorage(image.fileName);
      this.logger.log(`Deleted image file from storage: ${image.fileName}`);

      await this.storageService.deletedImageToStorage(image.thumbnailFileName);
      this.logger.log(
        `Deleted thumbnail file from storage: ${image.thumbnailFileName}`,
      );

      const result = await this.repository.deleteImage(id);
      this.logger.log(
        `Image with ID: ${id} successfully deleted from database`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to delete image with ID: ${id}. Error: ${error.message}`,
      );
      throw error;
    }
  }
}
