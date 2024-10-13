import { ImageTypesEnum } from './image-types.enum';

export class ImageDomain {
  id: string;
  type: ImageTypesEnum;
  url: string;
  constructor(id: string, type: ImageTypesEnum, url: string) {
    this.id = id;
    this.type = type;
    this.url = url;
  }
}
