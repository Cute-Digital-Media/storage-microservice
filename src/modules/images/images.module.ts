import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { StorageModule } from '../storage/storage.module';
import { ImageRepository } from './infra/image.repository';
import { ImageEntity } from './infra/entity/image.entity';
import { UseCaseProvider } from './app/use-cases';
import { CacheService } from '../../infrastructure/cache/cache.service';
import { LoggerService } from '../../infrastructure/loggers/logger.service';

@Module({
  controllers: [ImagesController],
  providers: [
    ImagesService,
    ImageRepository,
    JwtService,
    CacheService,
    LoggerService,
    ...UseCaseProvider,
  ],
  imports: [StorageModule, TypeOrmModule.forFeature([ImageEntity])],
})
export class ImagesModule {}
