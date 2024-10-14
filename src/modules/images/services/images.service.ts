/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, MoreThanOrEqual, LessThanOrEqual, Like } from 'typeorm';
import { Image } from '../entities/image.entity';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
        private redisService: RedisService
    ) { }

    async saveImage(filename: string, url: string, size: number, uploadedBy: string): Promise<Image> {
        const image = this.imageRepository.create({ filename, url, size, uploadedBy });
        const savedImage = await this.imageRepository.save(image);
        await this.redisService.set(`image:${savedImage.id}`, savedImage);
        return savedImage;
    }

    async getAllImages(): Promise<Image[]> {
        return await this.imageRepository.find(); 
    }

    async getImage(id: number): Promise<Image> {
        const cachedImage = await this.redisService.get<Image>(`image:${id}`);
        if (cachedImage) {
            return cachedImage;
        }
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) {
            return null;
        }

        await this.redisService.set(`image:${id}`, image);
        return image;
    }

    async deleteImage(id: number): Promise<void> {
        await this.imageRepository.delete(id);
        await this.redisService.del(`image:${id}`);
    }

    // Obtener todas las imágenes con filtros opcionales
    async getImagesWithFilters(filters: any): Promise<Image[]> {
        const where: FindOptionsWhere<Image> = {};

        if (filters.filename) {
            where.filename = Like(`%${filters.filename}%`);
        }
        if (filters.uploadedBy) {
            where.uploadedBy = filters.uploadedBy;
        }
        if (filters.minSize) {
            where.size = MoreThanOrEqual(Number(filters.minSize));
        }
        if (filters.maxSize) {
            where.size = LessThanOrEqual(Number(filters.maxSize));
        }

        return await this.imageRepository.find({ where });
    }
}
