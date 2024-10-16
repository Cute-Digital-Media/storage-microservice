import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ImageRepository } from '../../infra/image.repository';
import { LoggerService } from '../../../../infrastructure/loggers/logger.service';

@Injectable()
export class FindById {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
    private readonly logger: LoggerService,
  ) {}
  async execute(id: string) {
    try {
      this.logger.log(`Fetching images by id:${id}`);
      const image = await this.repository.finById(id);
      if (!image) {
        this.logger.warn(`Image with ID: ${id} not found`);
        throw new NotFoundException('Image not found');
      }
      this.logger.log(`Successfully fetched  image with id:${id}`);
      return image;
    } catch (error) {
      throw error;
    }
  }
}
