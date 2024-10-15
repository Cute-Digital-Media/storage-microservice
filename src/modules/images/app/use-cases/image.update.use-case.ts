import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from '../../infra/repository/image.repository';
import { ImageDomain } from '../../domain/image.domain';

@Injectable()
export class ImageUpdateUseCase {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
  ) {}

  async execute(id: string, image: ImageDomain){
    try {
      return await this.repository.updateImage(id, image);
    } catch (error) {
      throw error;
    }
  }
}
