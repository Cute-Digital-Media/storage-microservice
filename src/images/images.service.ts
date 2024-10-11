import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { ImageEntity } from './dto/entities/image.entity';
import { ImageDto } from './dto/image.dto';
import { ImageResponseDto } from './dto/image.response.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async uploadImage(imageDto: ImageDto) {
    imageDto.url = await this.firebaseService.uploadFile(imageDto.file);
    imageDto.file = undefined;
    const aux = await this.imageRepository.save({
      ...imageDto,
    } as ImageEntity);
    const response = { ...aux } as ImageResponseDto;
    return response;
  }
}
