import { Provider } from '@nestjs/common';
import { FinAllImage } from './fin-all-images.usecase';
import { FindById } from './find-by-id.usecase';
import { DeletedImage } from './deleted-image.usecase';
import { UploadImage } from './upload-image.usecase';

export const UseCaseProvider: Provider[] = [
  FinAllImage,
  FindById,
  DeletedImage,
  UploadImage,
];
