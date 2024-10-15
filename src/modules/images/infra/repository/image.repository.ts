import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageDomainRepository } from '../../domain/image.domain.repository';
import { ImageEntity } from '../entity/image.entity';
import { ImageDomain } from '../../domain/image.domain';
import { ImageMapper } from '../mapper/image.mapper';
import { NotFoundException } from '@nestjs/common';

export class ImageRepository implements ImageDomainRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repository: Repository<ImageEntity>,
    private readonly mapper: ImageMapper,
  ) {}

  async deleteImage(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async getAllImages(): Promise<ImageDomain[]> {
    const images = await this.repository.find();
    return images.map((image) => this.mapper.toDomain(image));
  }

  async getImageById(id: string): Promise<ImageDomain> {
    const image = await this.repository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return this.mapper.toDomain(image);
  }

  async save(image: ImageDomain): Promise<ImageDomain> {
    const entity = this.mapper.toEntity(image);
    return this.mapper.toDomain(await this.repository.save(entity));
  }

  async updateImage(id: string, image: ImageDomain): Promise<ImageDomain> {
    const targetImage = await this.repository.findOne({
      where: { id },
    });
    if (!targetImage) {
      throw new NotFoundException('Image not found');
    }
    const entity = this.mapper.toEntity(image);
    return this.mapper.toDomain(await this.repository.save(entity));
  }
}
