import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Express } from 'express';

export class UploadBullFileDto {
  @IsArray()
  @IsNotEmpty()
  files: Express.Multer.File[];

  @IsString()
  userId: string;
}
