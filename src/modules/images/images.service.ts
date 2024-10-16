import { Injectable, Logger } from '@nestjs/common';

import { FinAllImage } from './app/use-cases/fin-all-images.usecase';
import { DeletedImage } from './app/use-cases/deleted-image.usecase';
import { FindById } from './app/use-cases/find-by-id.usecase';
import { UploadImage } from './app/use-cases/upload-image.usecase';
import { FilterDto } from './app/dtos/filter.dto';
import { User } from '../users/domain/user.domain';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private readonly finAllImage: FinAllImage,
    private readonly deletedImage: DeletedImage,
    private readonly findById: FindById,
    private readonly uploadImage: UploadImage,
  ) {}

  async upload(file: Express.Multer.File, user: User) {
    try {
      this.logger.log(`Image created: by ${user.email}`);
      return await this.uploadImage.execute({ file, userId: user.id });
    } catch (error) {
      throw error;
    }
  }

  async findAll(filter: FilterDto) {
    try {
      return await this.finAllImage.execute(filter);
    } catch (error) {
      throw error;
    }
  }
  async findByIdImage(id: string) {
    try {
      return await this.findById.execute(id);
    } catch (error) {
      throw error;
    }
  }
  async deleted(id: string) {
    try {
      return await this.deletedImage.execute(id);
    } catch (error) {
      throw error;
    }
  }
}
