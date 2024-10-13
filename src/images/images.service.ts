import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'; // tambien se puede usar import { isUUID } from 'class-validator';
import { FirebaseImage } from './entities/firebase-image.entity';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger('ImagesService');
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(FirebaseImage)
    private readonly firebaseImageRepository: Repository<FirebaseImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createImageDto: CreateImageDto) {
    try {
      const { firebaseImage, ...createImageDtoDetails } = createImageDto;

      const image = this.imageRepository.create({
        ...createImageDtoDetails,
      });
      await this.imageRepository.save(image);
      return image;
    } catch (error) {
      this.handleErrorsExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;

    return await this.imageRepository.find({
      take: limit,
      skip: offset,
      relations: {
        firebaseImage: true,
      },
    });
  }

  async findOne(id: string): Promise<Image> {
    let image: Image;

    if (isUUID(id)) {
      image = await this.imageRepository.findOneBy({ id });
    } else {
      const queryBuilder =
        await this.imageRepository.createQueryBuilder('imgs');
      image = await queryBuilder
        .where('title =:title or description =:description', {
          title: id,
          description: id,
        })
        .leftJoinAndSelect('imgs.firebaseImage', 'frbImage')
        .getOne();
    }

    if (!image)
      throw new NotFoundException(`Image with search id ${id} not found`);
    return image;
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    const { firebaseImage, ...updateImageDtoDetails } = updateImageDto;

    const image = await this.imageRepository.preload({
      id,
      ...updateImageDtoDetails,
    });

    if (!image) throw new NotFoundException(`Image with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (firebaseImage) {
        await queryRunner.manager.delete(FirebaseImage, {
          firebaseImage: { id },
        });
        image.firebaseImage = this.firebaseImageRepository.create({
          url: firebaseImage,
        });
      }

      await queryRunner.manager.save(image);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleErrorsExceptions(error);
    }
  }

  async remove(id: string) {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
  }

  private handleErrorsExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Hi, somewhere is wrong, check server logs',
    );
  }
}
