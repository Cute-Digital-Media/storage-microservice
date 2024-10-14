import { ImageTypesEnum } from '../../domain/image-types.enum';
import { IsEnum, IsUrl, IsUUID } from 'class-validator';

export class ImageDto {
  @IsUUID()
  id?: string;
  @IsEnum(ImageTypesEnum)
  type: ImageTypesEnum;
  @IsUrl()
  url: string;
}
