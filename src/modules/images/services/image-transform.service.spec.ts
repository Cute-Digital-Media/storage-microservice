import { Test, TestingModule } from '@nestjs/testing';
import { ImageTransformService } from './image-transform.service';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

describe('ImageTransformService', () => {
    let service: ImageTransformService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageTransformService],
        }).compile();

        service = module.get<ImageTransformService>(ImageTransformService);
    });

    it('should resize the image correctly', async () => {
        // Lee la imagen desde el sistema de archivos
        const imagePath = path.join(__dirname, '../../../test/test-images/Screenshot254.png'); // Asegúrate de que la ruta sea correcta
        const imageBuffer = fs.readFileSync(imagePath);

        const width = 800;
        const height = 600;

        const resizedBuffer = await service.resizeImage(imageBuffer, width, height);
        const metadata = await sharp(resizedBuffer).metadata();

        expect(metadata.width).toBe(width);
        expect(metadata.height).toBe(height);
    });
});
