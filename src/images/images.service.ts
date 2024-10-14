import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { ImageEntity } from './dto/entities/image.entity';
import { ImageDto } from './dto/image.dto';
import { PaginationResultDto } from './pagination/pagination-result.dto';
import { PaginationDto } from './pagination/pagination.dto';
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

  async getAllImages(
    paginationData: PaginationDto,
  ): Promise<PaginationResultDto<ImageEntity>> {
    const offset = (paginationData.page - 1) * paginationData.pageSize;
    const [items, total] = await this.imageRepository.findAndCount({
      skip: offset,
      take: paginationData.pageSize,
      where: {
        ...(paginationData.filter?.tenant && {
          tenant: paginationData.filter.tenant,
        }),
        ...(paginationData.filter?.userId && {
          userId: paginationData.filter.userId,
        }),
        ...(paginationData.filter?.folderName && {
          folderName: paginationData.filter.folderName,
        }),
      },
    });

    return {
      items,
      meta: {
        currentPage: paginationData.page,
        itemCount: items.length,
        itemsPerPage: paginationData.pageSize,
        totalPages: Math.ceil(total / paginationData.pageSize),
        totalItems: total,
      },
    };
  }

  async deleteImage(id: number) {
    const image = await this.getImageById(id);
    await this.firebaseService.deleteImage(image);
    await this.imageRepository.delete(id);
  }
}
