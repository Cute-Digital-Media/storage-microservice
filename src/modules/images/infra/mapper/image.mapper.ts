import { ImageEntity } from '../entity/image.entity';
import { ImageDomain } from '../../domain/image.domain';
import { IImageMapper } from './image.mapper.interface';

export class ImageMapper implements IImageMapper {
  toDomain(entity: ImageEntity): ImageDomain {
    return ImageDomain.create( entity.type, entity.url,entity.id,);
  }

  toEntity(domain: ImageDomain): Partial<ImageEntity> {
    return {
      id: domain.id,
      type: domain.type,
      url: domain.url,
    };
  }
  toView(image: ImageDomain): Partial<ImageEntity> {
    return {
      id: image.id,
      url: image.url,
    };
  }
}
