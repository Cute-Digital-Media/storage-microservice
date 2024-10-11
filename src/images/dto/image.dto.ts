import { IsDate, IsInt, IsString, IsUrl } from 'class-validator';

export class ImageDto {
  @IsString()
  name: string;

  @IsDate()
  uploadDate: Date;

  @IsInt()
  orininalSize: number;

  @IsInt()
  compressedSize: number;

  @IsUrl()
  url: string;

  file: Express.Multer.File;
}
