import { ImageDomain } from './image.domain';

export interface ImageDomainRepository {
  save(image: ImageDomain): Promise<ImageDomain>;
  getAllImages(): Promise<ImageDomain[]>;
  updateImage(id: string, image: ImageDomain): Promise<ImageDomain>;
  deleteImage(id: string): Promise<void>;
  getImageById(id: string): Promise<ImageDomain>;
}
