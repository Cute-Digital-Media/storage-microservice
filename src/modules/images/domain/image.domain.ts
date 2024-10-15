import { ImageTypesEnum } from './image-types.enum';
import { v4 as uuidv4 } from 'uuid';
export class ImageDomain {
  id: string;
  type: ImageTypesEnum;
  url: string;
  constructor(id: string, type: ImageTypesEnum, url: string) {
    this.id = id;
    this.type = type;
    this.url = url;
  }

  public static create( type: ImageTypesEnum, url: string, id?: string): ImageDomain {
    id = id ?? uuidv4();
    return new ImageDomain(id, type, url);
  }
}
