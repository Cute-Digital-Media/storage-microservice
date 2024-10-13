import { ImageEntity } from '../entity/image.entity';
import { ImageDomain } from '../../domain/image.domain';

export interface IImageMapper {
  toDomain(image: ImageEntity): ImageDomain;
  toEntity(image: ImageDomain): Partial<ImageEntity>;
}
