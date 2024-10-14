import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageTransformService {
    async resizeImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {
        const resizedBuffer = await sharp(buffer)
            .resize(width, height, {
                fit: 'inside', 
                withoutEnlargement: true,
            })
            .toBuffer();

        return resizedBuffer;
    }
}
