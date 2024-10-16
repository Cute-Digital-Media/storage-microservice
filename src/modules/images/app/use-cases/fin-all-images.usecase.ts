import { Inject, Injectable } from '@nestjs/common';

import { ImageRepository } from '../../infra/image.repository';
import { FilterDto } from '../dtos/filter.dto';
import { LoggerService } from '../../../../infrastructure/loggers/logger.service';

@Injectable()
export class FinAllImage {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute({ limit = 10, page = 1 }: FilterDto) {
    try {
      this.logger.log(`Fetching images with limit: ${limit} and page: ${page}`);

      const images = await this.repository.findImages({ limit, page });

      this.logger.log(`Successfully fetched ${images.length} images`);

      return images;
    } catch (error) {
      this.logger.error(`Failed to fetch images. Error: ${error.message}`);
      throw error;
    }
  }
}
