import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
