import { FileInfo } from '../pipes/file-info';
import { ImageResponseDto } from './image.response.dto';

export class ImageDto extends ImageResponseDto {
  fileInfo: FileInfo;
}
