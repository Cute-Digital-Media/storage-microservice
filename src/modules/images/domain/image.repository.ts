import { FilterDto } from '../app/dtos/filter.dto';
import { ImageEntity } from '../infra/entity/image.entity';
import { Image } from './image.domain';

export interface ImagenRepositoryI {
  save(image: Image): Promise<ImageEntity>;
  findImages(filter: FilterDto): Promise<ImageEntity[]>;
  deleteImage(id: string): Promise<void>;
  finById(id: string): Promise<ImageEntity>;
}
