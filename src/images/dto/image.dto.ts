import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class ImageDto {
  @IsString()
  originalFileName: string;

  @IsString()
  @IsOptional()
  searchableFileName?: string;

  @IsString()
  @IsOptional()
  folderName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  uploadDate?: Date;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  originalSize?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  compressedSize?: number;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @Type(() => Buffer)
  buffer?: Buffer;
}
