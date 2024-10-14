/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { Image } from '../entities/image.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from '../../redis/redis.service';

// Mock de la imagen
const mockImage: Image = {
    id: 1,
    filename: 'test.png',
    url: 'https://example.com/test.png',
    size: 1024,
    uploadedBy: 'user_test',
    createdAt: new Date(),
};

// Mock del repositorio de imágenes
const mockImageRepository = {
    create: jest.fn().mockReturnValue(mockImage),
    save: jest.fn().mockResolvedValue(mockImage),
    find: jest.fn().mockResolvedValue([mockImage]),
    findOne: jest.fn().mockResolvedValue(mockImage),
    delete: jest.fn(),
};

// Mock del RedisService
const mockRedisService = {
    set: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(JSON.stringify(mockImage)), // Devuelve un JSON stringificado de la imagen
    del: jest.fn().mockResolvedValue(undefined),
};

describe('ImagesService', () => {
    let service: ImagesService;
    let imageRepository: Repository<Image>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImagesService,
                {
                    provide: getRepositoryToken(Image),
                    useValue: mockImageRepository,
                },
                {
                    provide: FirebaseService,
                    useValue: {
                        uploadImage: jest.fn(),
                        deleteImage: jest.fn(),
                    },
                },
                {
                    provide: RedisService,
                    useValue: mockRedisService, // Usando el mock del RedisService
                },
            ],
        }).compile();

        service = module.get<ImagesService>(ImagesService);
        imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Agrega más pruebas aquí...
});
