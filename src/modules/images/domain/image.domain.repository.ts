import { ImageDomain } from './image.domain';

export interface ImageDomainRepository {
  save(image: ImageDomain): Promise<void>;
  getAllImages(): Promise<ImageDomain[]>;
  updateImage(id: string, image: ImageDomain): Promise<void>;
  deleteImage(id: string): Promise<void>;
  getImageById(id: string): Promise<ImageDomain>;
}
