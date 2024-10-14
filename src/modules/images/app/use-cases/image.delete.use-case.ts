import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from '../../infra/repository/image.repository';

@Injectable()
export class ImageDeleteUseCase {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
  ) {}
  async execute(id: string) {
    return await this.repository.deleteImage(id);
  }
}
