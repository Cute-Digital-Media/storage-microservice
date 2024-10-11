// image-processing.service.ts
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageResizeService {
  async resizeAndOptimize(
    buffer: Buffer,
    width: number,
    height: number,
    format: keyof sharp.FormatEnum = 'jpeg', // Formato de salida por defecto: JPEG
  ): Promise<Buffer> {
    return sharp(buffer)
      .resize({ width, height, fit: 'inside', withoutEnlargement: true }) // Redimensiona sin agrandar
      .toFormat(format, { quality: 90 }) // Convierte al formato especificado con calidad 90 (ajusta según tus necesidades)
      .toBuffer();
  }
}