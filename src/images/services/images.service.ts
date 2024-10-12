import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async getImage(id: number): Promise<Image> {
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) {
            throw new BadRequestException('Imagen no encontrada');
        }
        return image;
    }
}
