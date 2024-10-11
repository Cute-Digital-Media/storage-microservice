import { ImageDto } from './image.dto';

export class ImageResponseDto extends (ImageDto as new () => Omit<
  ImageDto,
  'file'
>) {}
