import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { ImageEntity } from './dto/entities/image.entity';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async uploadImage(imageDto: ImageDto): Promise<ImageEntity> {
    imageDto.url = await this.firebaseService.uploadImage(imageDto);
    imageDto.buffer = undefined;
    return await this.imageRepository.save({
      ...imageDto,
    } as ImageEntity);
  }

  async getImageById(id: number): Promise<ImageEntity> {
    const imageEntity = await this.imageRepository.findOne({ where: { id } });
    if (!imageEntity) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }
    return imageEntity;
  }

  async getImageByName(name: string): Promise<ImageEntity> {
    const imageEntity = await this.imageRepository.findOne({
      where: { searchableFileName: ILike(`%${name}%`) },
    });
    if (!imageEntity) {
      throw new NotFoundException(`Image with name '${name}' not found`);
    }
    return imageEntity;
  }
}
