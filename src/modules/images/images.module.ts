import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './infra/entity/image.entity';
import { ImageRepository } from './infra/repository/image.repository';
import { ImageMapper } from './infra/mapper/image.mapper';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { FirebaseModule } from '../config/firebase/firebase.module';
import { FirebaseService } from '../config/firebase/firebase.service';
import { ImageCreateUseCase } from './app/use-cases/image.create.use-case';
import { ImageShowUseCase } from './app/use-cases/image.show.use-case';
import { ImageIndexUseCase } from './app/use-cases/image.index.use-case';
import { ImageDeleteUseCase } from './app/use-cases/image.delete.use-case';
import { ImageUpdateUseCase } from './app/use-cases/image.update.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), FirebaseModule],
  providers: [
    ImageRepository,
    ImageMapper,
    ImagesService,
    FirebaseService,
    ImageCreateUseCase,
    ImageShowUseCase,
    ImageIndexUseCase,
    ImageDeleteUseCase,
    ImageUpdateUseCase,
  ],
  exports: [ImageRepository],
  controllers: [ImagesController],
})
export class ImagesModule {}
