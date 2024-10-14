import { ImageRepository } from '../../infra/repository/image.repository';
import { Inject, NotFoundException } from '@nestjs/common';

export class ImageShowUseCase {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
  ) {}
  async execute(id: string) {
    try {
      const image = await this.repository.getImageById(id);
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      return image;
    } catch (error) {
      throw error;
    }
  }
}
