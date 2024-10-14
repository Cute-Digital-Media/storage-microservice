import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, MoreThanOrEqual, LessThanOrEqual,Like } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>,
    ) { }

    async saveImage(filename: string, url: string, size: number, uploadedBy: string): Promise<Image> {
        const image = this.imageRepository.create({ filename, url, size, uploadedBy });
        return this.imageRepository.save(image);
    }

    // Nuevo método para obtener todas las imágenes
    async getAllImages(): Promise<Image[]> {
        return await this.imageRepository.find(); // Devuelve todas las imágenes
    }
    
    async getImage(id: number): Promise<Image> {
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) {
            throw new BadRequestException('Imagen no encontrada');
        }
        return image;
    }

    async deleteImage(id: number): Promise<void> {
        await this.imageRepository.delete(id);
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
