import { ImageEntity } from '../entity/image.entity';
import { ImageDomain } from '../../domain/image.domain';
import { IImageMapper } from './image.mapper.interface';
import { v4 as uuidv4 } from 'uuid';

export class ImageMapper implements IImageMapper {
  toDomain(entity: ImageEntity): ImageDomain {
    const id = uuidv4();
    return new ImageDomain(id, entity.type, entity.url);
  }

  toEntity(domain: ImageDomain): Partial<ImageEntity> {
    const props = {
      id: domain.id,
      type: domain.type,
      url: domain.url,
    };
    return props;
  }
}
