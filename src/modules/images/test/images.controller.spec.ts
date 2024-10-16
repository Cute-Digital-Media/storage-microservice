import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ImagesController } from '../images.controller';
import { ImagesService } from '../images.service';
import { FilterDto } from '../app/dtos/filter.dto';
import { JwtMockGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { getMockFile, getMockImage, getMockUser } from './mocks';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  const mockImagesService = {
    upload: jest.fn(),
    findAll: jest.fn(),
    findByIdImage: jest.fn(),
    deleted: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    })
      .overrideGuard(JwtMockGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const mockUser = getMockUser();
      const mockFile = getMockFile();
      const mockImage = getMockImage();

      mockImagesService.upload.mockResolvedValue(mockImage);

      const result = await controller.uploadImage(mockFile, mockUser);

      expect(service.upload).toHaveBeenCalledWith(mockFile, mockUser);
      expect(result).toEqual(mockImage);
    });
  });

  describe('getAllImage', () => {
    it('should return paginated images', async () => {
      const mockPaginationDto: FilterDto = { limit: 10, page: 1 };
      const mockImages = [getMockImage()];

      mockImagesService.findAll.mockResolvedValue(mockImages);

      const result = await controller.getAllImage(mockPaginationDto);

      expect(service.findAll).toHaveBeenCalledWith(mockPaginationDto);
      expect(result).toEqual(mockImages);
    });
  });

  describe('getImageById', () => {
    it('should return a specific image by id', async () => {
      const mockImage = getMockImage();
      const imageId = 'some-uuid';

      mockImagesService.findByIdImage.mockResolvedValue(mockImage);

      const result = await controller.findByIdImage(imageId);

      expect(service.findByIdImage).toHaveBeenCalledWith(imageId);
      expect(result).toEqual(mockImage);
    });

    it('should throw an error if image not found', async () => {
      const imageId = 'non-existing-uuid';

      mockImagesService.findByIdImage.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findByIdImage(imageId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletedImage', () => {
    it('should delete an image by id', async () => {
      const imageId = 'some-uuid';

      mockImagesService.deleted.mockResolvedValue(undefined);

      const result = await controller.deletedImage(imageId);

      expect(service.deleted).toHaveBeenCalledWith(imageId);
      expect(result).toBeUndefined();
    });
  });
});
