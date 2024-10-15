import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from '../../infra/repository/image.repository';
import { ImageDomain } from '../../domain/image.domain';
@Injectable()
export class ImageCreateUseCase {
  constructor(
    @Inject(ImageRepository) private readonly repository: ImageRepository,
  ) {}
  async execute(image: ImageDomain): Promise<ImageDomain> {
    try {
      return await this.repository.save(image);
    } catch (error) {
      throw error;
    }
  }
}
