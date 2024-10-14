/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './images.controller';
import { ImagesService } from './services/images.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ImageTransformService } from './services/image-transform.service'; // Asegúrate de importar esto
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ImageController', () => {
    let controller: ImageController;
    let imageService: ImagesService;
    let firebaseService: FirebaseService;
    let imageTransformService: ImageTransformService; // Agrega esto

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ImageController],
            providers: [
                {
                    provide: ImagesService,
                    useValue: {
                        saveImage: jest.fn(),
                        getAllImages: jest.fn(),
                        getImagesWithFilters: jest.fn(),
                        getImage: jest.fn(),
                        deleteImage: jest.fn(),
                    },
                },
                {
                    provide: FirebaseService,
                    useValue: {
                        uploadImage: jest.fn(),
                        deleteImage: jest.fn(),
                    },
                },
                {
                    provide: ImageTransformService, // Agrega el mock para el servicio
                    useValue: {
                        transformImage: jest.fn(), // Ajusta según el método que uses
                    },
                },
            ],
        }).compile();

        controller = module.get<ImageController>(ImageController);
        imageService = module.get<ImagesService>(ImagesService);
        firebaseService = module.get<FirebaseService>(FirebaseService);
        imageTransformService = module.get<ImageTransformService>(ImageTransformService); // Agrega esto
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('uploadImage', () => {
        it('should upload an image successfully', async () => {
            const mockFile = {
                originalname: 'test.jpg',
                buffer: Buffer.from('test'),
                size: 4,
            } as Express.Multer.File;

            const mockImage = {
                id: 1,
                url: 'mock-url',
                filename: 'mock-filename.png',
                size: 12345,
                uploadedBy: 'testUser',
                createdAt: new Date(),
            };

            jest.spyOn(firebaseService, 'uploadImage').mockResolvedValue('mock-url');
            jest.spyOn(imageService, 'saveImage').mockResolvedValue(mockImage);

            const result = await controller.uploadImage(mockFile, 'testUser');
            expect(result).toEqual({
                message: 'Image uploaded successfully',
                image: mockImage,
            });
        });

        it('should throw an error if no file is provided', async () => {
            await expect(controller.uploadImage(null, 'testUser')).rejects.toThrow(BadRequestException);
        });

        it('should throw an error if the file is too large', async () => {
            const mockFile = {
                originalname: 'test.jpg',
                size: 6 * 1024 * 1024, // 6 MB
            } as Express.Multer.File;

            await expect(controller.uploadImage(mockFile, 'testUser')).rejects.toThrow(BadRequestException);
        });
    });

    describe('getImages', () => {
        it('should return an array of images', async () => {
            jest.spyOn(imageService, 'getAllImages').mockResolvedValue([]);
            const result = await controller.getImages();
            expect(result).toEqual([]);
        });

        it('should return filtered images based on filename', async () => {
            const mockImages = [{
                id: 1,
                filename: 'test.jpg',
                url: 'mock-url',
                size: 12345,
                uploadedBy: 'mock-user',
                createdAt: new Date(),
            }];
            jest.spyOn(imageService, 'getImagesWithFilters').mockResolvedValue(mockImages);
            const result = await controller.getImages('test.jpg');
            expect(result).toEqual(mockImages);
        });
    });

    describe('getImage', () => {
        it('should return an image by ID', async () => {
            const mockImage = {
                id: 1,
                filename: 'test.jpg',
                url: 'mock-url',
                size: 12345,
                uploadedBy: 'mock-user',
                createdAt: new Date(),
            };
            jest.spyOn(imageService, 'getImage').mockResolvedValue(mockImage);
            const result = await controller.getImage(1);
            expect(result).toEqual(mockImage);
        });

        it('should throw NotFoundException if the image does not exist', async () => {
            jest.spyOn(imageService, 'getImage').mockResolvedValue(null);
            await expect(controller.getImage(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteImage', () => {
        it('should delete an image by ID', async () => {
            const mockImage = {
                id: 1,
                url: 'mock-url',
                filename: 'mock-filename.png',
                size: 12345,
                uploadedBy: 'mock-user',
                createdAt: new Date(),
            };
            jest.spyOn(imageService, 'getImage').mockResolvedValue(mockImage);
            jest.spyOn(firebaseService, 'deleteImage').mockResolvedValue(undefined);
            jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);

            const result = await controller.deleteImage(1);
            expect(result).toEqual({ message: 'Imagen con ID 1 eliminada exitosamente' });
        });

        it('should throw NotFoundException if the image does not exist', async () => {
            jest.spyOn(imageService, 'getImage').mockResolvedValue(null);
            await expect(controller.deleteImage(999)).rejects.toThrow(NotFoundException);
        });
    });
});
