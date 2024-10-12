import { Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import { FileInfo } from './file-info';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<FileInfo>>
{
  async transform(image: Express.Multer.File): Promise<FileInfo> {
    const originalName = image.originalname.split('.')[0];
    const originalSize = image.size;
    const buffer = await sharp(image.buffer)
      .rotate()
      .resize({ height: 800, fit: 'inside', withoutEnlargement: true })
      .webp({ effort: 3, quality: 90 })
      .toBuffer();
    const compressedSize = Buffer.byteLength(buffer);
    return { originalName, originalSize, compressedSize, buffer };
  }
}
