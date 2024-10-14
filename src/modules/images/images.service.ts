import { Inject, Injectable } from '@nestjs/common';
import { ImageCreateUseCase } from './app/use-cases/image.create.use-case';
import { ImageDomain } from './domain/image.domain';
import { ImageShowUseCase } from './app/use-cases/image.show.use-case';
import { FirebaseService } from '../config/firebase/firebase.service';
import { ImageTypesEnum } from './domain/image-types.enum';
import { ImageMapper } from './infra/mapper/image.mapper';
import { ImageIndexUseCase } from './app/use-cases/image.index.use-case';
import { ImageDeleteUseCase } from './app/use-cases/image.delete.use-case';
import { ImageUpdateUseCase } from './app/use-cases/image.update.use-case';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(ImageCreateUseCase) private readonly useCase: ImageCreateUseCase,
    @Inject(ImageShowUseCase) private readonly showUseCase: ImageShowUseCase,
    @Inject(ImageIndexUseCase) private readonly imageIndexShowCase: ImageIndexUseCase,
    @Inject(ImageDeleteUseCase) private readonly deleteUseCase: ImageDeleteUseCase,
    @Inject(ImageUpdateUseCase) private readonly updateUseCase: ImageUpdateUseCase,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
    private readonly imageMapper: ImageMapper,
  ) {}

  async create(file: Express.Multer.File) {
    try {
      const res = await this.firebaseService.uploadFile(file);
      const type = ImageTypesEnum[file.mimetype.split('/')[1]];
      const imageDomain = new ImageDomain(res.id, type, res.url);
      return this.imageMapper.toView(await this.useCase.execute(imageDomain));
    } catch (error) {
      throw error;
    }
  }
  async show(id: string) {
    return this.imageMapper.toView(await this.showUseCase.execute(id));
  }
  async index(){
    try {
      const images = await this.imageIndexShowCase.execute();
      return images.map((image) => this.imageMapper.toView(image));
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string) {
    try {
      const image = await this.showUseCase.execute(id);
      await this.firebaseService.deleteFile(image);
      return await this.deleteUseCase.execute(id);
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, file: Express.Multer.File) {
    try {
      const image = await this.showUseCase.execute(id);
      const res = await this.firebaseService.updateFile(image, file);
      const type = ImageTypesEnum[file.mimetype.split('/')[1]];
      const imageDomain = new ImageDomain(res.id, type, res.url);
      return this.imageMapper.toView(
        await this.updateUseCase.execute(id, imageDomain),
      );
    } catch (error) {
      throw error;
    }
  }
}
