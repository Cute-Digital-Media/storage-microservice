/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ImageTransformService } from './image-transform.service';
import * as sharp from 'sharp';
import * as Jimp from 'jimp';



describe('ImageTransformService', () => {
    let service: ImageTransformService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageTransformService],
        }).compile();

        service = module.get<ImageTransformService>(ImageTransformService);
    });

    it('should resize the image correctly', async () => {
        try {
            // Imagen en memoria usando el constructor
            const image = new Jimp(800, 600, 0xFFFFFFFF); // Imagen blanca de 800x600
            const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

            const width = 400;
            const height = 300; 

            // Llamar al servicio para redimensionar la imagen
            const resizedBuffer = await service.resizeImage(imageBuffer, width, height);

            // Verificar el tamaño con sharp
            const metadata = await sharp(resizedBuffer).metadata();
            expect(metadata.width).toBe(width);
            expect(metadata.height).toBe(height);
        } catch (error) {
            console.error('Error during test:', error);
            throw error;
        }
    });
});
