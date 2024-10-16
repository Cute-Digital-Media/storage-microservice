import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ImagenRepositoryI } from '../domain/image.repository';
import { ImageEntity } from './entity/image.entity';
import { FilterDto } from '../app/dtos/filter.dto';
import { Image } from '../domain/image.domain';
import { CacheService } from '../../../infrastructure/cache/cache.service';

@Injectable()
export class ImageRepository implements ImagenRepositoryI {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repository: Repository<ImageEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async deleteImage(id: string): Promise<void> {
    await this.repository.delete(id);
    await this.cacheService.invalidateCached(`image${id}`);
    await this.cacheService.invalidateCachedPattern('images*');
    return;
  }

  async findImages({ limit = 10, page = 1 }: FilterDto) {
    const keyRedis = `images?limit=${limit}&page=${page}`;

    const cache = await this.cacheService.readCached<ImageEntity[]>(keyRedis);

    if (cache) return cache;

    const images = await this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    await this.cacheService.writeCached(keyRedis, images);

    return images;
  }

  async finById(id: string): Promise<ImageEntity> {
    const keyRedis = `image_${id}`;

    const cache = await this.cacheService.readCached<ImageEntity>(keyRedis);

    if (cache) return cache;

    const image = await this.repository.findOne({ where: { id } });

    await this.cacheService.writeCached(keyRedis, image);

    return image;
  }

  async save(data: Image): Promise<ImageEntity> {
    const image = this.repository.create({
      ...data,
    });
    await this.cacheService.invalidateCachedPattern('images*');
    return await this.repository.save(image);
  }
}
