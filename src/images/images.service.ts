import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ILike, Repository } from 'typeorm';
import { Logger } from 'winston';
import { FirebaseService } from '../firebase/firebase.service';
import { RedisCacheService } from '../redis/redis-cache.service';
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
    private readonly cache: RedisCacheService,
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async uploadImage(imageDto: ImageDto): Promise<ImageEntity> {
    imageDto.url = await this.firebaseService.uploadImage(imageDto);
    const buffer = imageDto.buffer;
    imageDto.buffer = undefined;

    const imageResponse = await this.imageRepository.save({
      ...imageDto,
    } as ImageEntity);

    try {
      await this.cache.set(imageDto.url, buffer);
    } catch (error) {
      throw new InternalServerErrorException(`Error when storing in cache`);
    }

    this.logger.info(
      `User '${imageDto.userId}' uploaded image '${imageDto.firebaseFileName}' to folder '${imageDto.tenant}/${imageDto.userId}/${imageDto.folderName}'`,
    );

    return imageResponse;
  }

  async getImageById(id: number): Promise<ImageDto> {
    const imageEntity = await this.imageRepository.findOne({ where: { id } });
    if (!imageEntity) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }
    const buffer = await this.getImageBufferFromUrl(imageEntity.url);
    return { ...imageEntity, buffer };
  }

  async getImageByName(name: string): Promise<ImageDto> {
    const imageEntity = await this.imageRepository.findOne({
      where: { searchableFileName: ILike(`%${name}%`) },
    });
    if (!imageEntity) {
      throw new NotFoundException(`Image with name '${name}' not found`);
    }
    const buffer = await this.getImageBufferFromUrl(imageEntity.url);
    return { ...imageEntity, buffer };
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
    await this.firebaseService.deleteImage(image as ImageEntity);
    await this.imageRepository.delete(id);
    this.logger.info(
      `User '${image.userId}' deleted image '${image.firebaseFileName}' from folder '${image.tenant}/${image.userId}/${image.folderName}'`,
    );
  }

  async getImageBufferFromUrl(url: string) {
    let buffer = await this.cache.get<Buffer>(url);
    if (!buffer) {
      const response = await this.httpService.axiosRef({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
      });
      const responseBuffer = Buffer.from(response.data, 'binary');

      try {
        await this.cache.set(url, responseBuffer);
      } catch (error) {
        throw new InternalServerErrorException(`Error when storing in cache`);
      }
      buffer = JSON.parse(JSON.stringify(responseBuffer));
    }
    return buffer;
  }
}
