import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { FirebaseConfig } from '../../../infrastructure/firebase/firebase.service';
import { StorageService } from '../storage.service';

describe('StorageService', () => {
  let storageService: StorageService;
  let mockFirebaseConfig: FirebaseConfig;

  const mockBucket = {
    file: jest.fn(),
  };

  const mockFile = {
    save: jest.fn(),
    makePublic: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    mockFirebaseConfig = {
      getBucket: jest.fn().mockReturnValue(mockBucket),
    } as unknown as FirebaseConfig;

    mockBucket.file.mockReturnValue(mockFile);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: FirebaseConfig,
          useValue: mockFirebaseConfig,
        },
      ],
    }).compile();

    storageService = module.get<StorageService>(StorageService);
  });

  describe('uploadImageToStorage', () => {
    it('should upload an image to storage and return the public URL', async () => {
      const buffer = Buffer.from('image data');
      const fileName = 'test-image.png';
      const mimetype = 'image/png';

      await storageService.uploadImageToStorage(buffer, fileName, mimetype);

      expect(mockBucket.file).toHaveBeenCalledWith(fileName);
      expect(mockFile.save).toHaveBeenCalledWith(buffer, {
        metadata: {
          contentType: mimetype,
        },
      });
      expect(mockFile.makePublic).toHaveBeenCalled();
      expect(mockFirebaseConfig.getBucket).toHaveBeenCalled();
    });

    it('should throw a BadRequestException if upload fails', async () => {
      const buffer = Buffer.from('image data');
      const fileName = 'test-image.png';
      const mimetype = 'image/png';

      mockFile.save.mockRejectedValue(new ConflictException('Upload failed'));

      await expect(
        storageService.uploadImageToStorage(buffer, fileName, mimetype),
      ).rejects.toThrow(ConflictException);
      expect(mockFile.save).toHaveBeenCalled();
    });
  });

  describe('deletedImageToStorage', () => {
    it('should delete an image from storage', async () => {
      const fileName = 'test-image.png';

      await storageService.deletedImageToStorage(fileName);

      expect(mockBucket.file).toHaveBeenCalledWith(fileName);
      expect(mockFile.delete).toHaveBeenCalled();
    });

    it('should throw a BadRequestException if delete fails', async () => {
      const fileName = 'test-image.png';

      mockFile.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(
        storageService.deletedImageToStorage(fileName),
      ).rejects.toThrow(ConflictException);
      expect(mockFile.delete).toHaveBeenCalled();
    });
  });
});
