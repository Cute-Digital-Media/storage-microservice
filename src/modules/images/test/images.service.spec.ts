import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Image } from '../entites/image.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FirebaseConfig } from '../../../shared/context/firebase.config';
import { ImagesService } from '../services/images.service';

describe('ImagesService', () => {
  let service: ImagesService;
  let imageRepository: Repository<Image>;
  let cacheManager: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let firebaseConfig: FirebaseConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: getRepositoryToken(Image),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: FirebaseConfig,
          useValue: {
            getBucket: jest.fn().mockReturnValue({
              file: jest.fn().mockReturnThis(),
              delete: jest.fn(),
              save: jest.fn(),
              getSignedUrl: jest.fn().mockResolvedValue(['mock-url']),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
    cacheManager = module.get(CACHE_MANAGER);
    firebaseConfig = module.get<FirebaseConfig>(FirebaseConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image and return the saved image', async () => {
      const mockFile = {
        originalname: 'test-image.jpg',
        buffer: Buffer.from('mock buffer'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockImage = {
        id: '1',
        fileName: 'test-image.jpg',
        url: 'mock-url',
        thumbnailUrl: 'mock-thumbnail-url',
        mimeType: 'image/jpeg',
        size: 1024,
        uploaderBy: 'user-id',
      };

      jest.spyOn(imageRepository, 'create').mockReturnValue(mockImage as any);
      jest.spyOn(imageRepository, 'save').mockResolvedValue(mockImage as any);
      jest
        .spyOn(service, 'generateThumbnail')
        .mockResolvedValue(Buffer.from('mock-thumbnail'));
      jest.spyOn(service, 'uploadImageToStorage').mockResolvedValue('mock-url');

      const result = await service.uploadImage({
        file: mockFile,
        userId: 'user-id',
      });

      expect(result).toEqual(mockImage);
      expect(service.uploadImageToStorage).toHaveBeenCalled();
    });

    it('should throw an error if the file is not provided', async () => {
      await expect(
        service.uploadImage({ file: null, userId: 'user-id' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image and remove it from cache and database', async () => {
      const mockImage = {
        id: '1',
        fileName: 'test-image.jpg',
        thumbnailFileName: 'thumbnail-test-image.jpg',
      };

      jest.spyOn(service, 'getImageById').mockResolvedValue(mockImage as any);
      jest.spyOn(service, 'deletedImageToStorage').mockResolvedValue(undefined);
      jest.spyOn(imageRepository, 'remove').mockResolvedValue(undefined);

      await service.deleteImage('1');

      expect(service.getImageById).toHaveBeenCalledWith('1');
      expect(service.deletedImageToStorage).toHaveBeenCalledWith(
        'test-image.jpg',
      );
      expect(service.deletedImageToStorage).toHaveBeenCalledWith(
        'thumbnail-test-image.jpg',
      );
      expect(imageRepository.remove).toHaveBeenCalledWith(mockImage);
      expect(cacheManager.del).toHaveBeenCalledWith('images_*');
    });

    it('should throw a NotFoundException if the image does not exist', async () => {
      jest.spyOn(service, 'getImageById').mockResolvedValue(null);

      await expect(service.deleteImage('1')).rejects.toThrow(NotFoundException);
    });
  });
});
