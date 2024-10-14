import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ImageEntity } from './image.enity';

type ImageWithout = Omit<
  ImageEntity,
  'id' | 'tenant_id' | 'user_id' | 'url' | 'full_path' | 'file_name'| 'folder_path'
>;

export class UploadImageDto implements ImageWithout {
  @ApiProperty({
    description:
      'Name of the folder to upload the image. If it is empty, the image will be uploaded in the root folder',
    example: 'images',
  })
  @IsString()
  @Matches(/(^[a-z0-9.]*$)/, { message: 'Cannot contain characters like /' })
  folder_name: string;
}
