import { Test, TestingModule } from '@nestjs/testing';

import { ImagesService } from '../images.service';
import { FinAllImage } from '../app/use-cases/fin-all-images.usecase';
import { DeletedImage } from '../app/use-cases/deleted-image.usecase';
import { FindById } from '../app/use-cases/find-by-id.usecase';
import { UploadImage } from '../app/use-cases/upload-image.usecase';
import { FilterDto } from '../app/dtos/filter.dto';
import { getMockUser, getMockFile, getMockImage } from './mocks';

describe('ImagesService', () => {
  let service: ImagesService;

  const mockFinAllImage = {
    execute: jest.fn(),
  };

  const mockDeletedImage = {
    execute: jest.fn(),
  };

  const mockFindById = {
    execute: jest.fn(),
  };

  const mockUploadImage = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: FinAllImage, useValue: mockFinAllImage },
        { provide: DeletedImage, useValue: mockDeletedImage },
        { provide: FindById, useValue: mockFindById },
        { provide: UploadImage, useValue: mockUploadImage },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload an image and log the upload event', async () => {
      const mockUser = getMockUser();
      const mockFile = getMockFile();
      const mockImage = getMockImage();

      mockUploadImage.execute.mockResolvedValue(mockImage);

      const result = await service.upload(mockFile, mockUser);

      expect(mockUploadImage.execute).toHaveBeenCalledWith({
        file: mockFile,
        userId: mockUser.id,
      });
      expect(result).toEqual(mockImage);
    });

    it('should throw an error if upload fails', async () => {
      const mockUser = getMockUser();
      const mockFile = getMockFile();

      mockUploadImage.execute.mockRejectedValue(new Error('Upload failed'));

      await expect(service.upload(mockFile, mockUser)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all images with filters', async () => {
      const mockImages = [getMockImage()];
      const mockFilter: FilterDto = { limit: 10, page: 1 };

      mockFinAllImage.execute.mockResolvedValue(mockImages);

      const result = await service.findAll(mockFilter);

      expect(mockFinAllImage.execute).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual(mockImages);
    });

    it('should throw an error if findAll fails', async () => {
      const mockFilter: FilterDto = { limit: 10, page: 1 };

      mockFinAllImage.execute.mockRejectedValue(new Error('FindAll failed'));

      await expect(service.findAll(mockFilter)).rejects.toThrow(
        'FindAll failed',
      );
    });
  });

  describe('findByIdImage', () => {
    it('should retrieve an image by id', async () => {
      const mockImage = getMockImage();
      const imageId = 'some-uuid';

      mockFindById.execute.mockResolvedValue(mockImage);

      const result = await service.findByIdImage(imageId);

      expect(mockFindById.execute).toHaveBeenCalledWith(imageId);
      expect(result).toEqual(mockImage);
    });

    it('should throw an error if findById fails', async () => {
      const imageId = 'some-uuid';

      mockFindById.execute.mockRejectedValue(new Error('FindById failed'));

      await expect(service.findByIdImage(imageId)).rejects.toThrow(
        'FindById failed',
      );
    });
  });

  describe('deleted', () => {
    it('should delete an image by id', async () => {
      const imageId = 'some-uuid';

      mockDeletedImage.execute.mockResolvedValue(undefined);

      const result = await service.deleted(imageId);

      expect(mockDeletedImage.execute).toHaveBeenCalledWith(imageId);
      expect(result).toBeUndefined();
    });

    it('should throw an error if delete fails', async () => {
      const imageId = 'some-uuid';

      mockDeletedImage.execute.mockRejectedValue(new Error('Delete failed'));

      await expect(service.deleted(imageId)).rejects.toThrow('Delete failed');
    });
  });
});
