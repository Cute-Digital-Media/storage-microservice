import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './infra/entity/image.entity';
import { ImageRepository } from './infra/repository/image.repository';
import { ImageMapper } from './infra/mapper/image.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImageRepository, ImageMapper],
  exports: [ImageRepository],
})
export class ImagesModule {}
