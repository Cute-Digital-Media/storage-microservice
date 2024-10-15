import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from '../../infra/repository/image.repository';
import { ImageDomain } from '../../domain/image.domain';
@Injectable()
export class ImageIndexUseCase {
  constructor(
    @Inject(ImageRepository) private readonly imagenRepository: ImageRepository,
  ) {}
  async execute(): Promise<ImageDomain[]> {
    try {
      return await this.imagenRepository.getAllImages();
    } catch (error) {
      throw error;
    }
  }
}
