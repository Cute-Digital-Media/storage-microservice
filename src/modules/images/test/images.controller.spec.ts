import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from '../services/images.service';
import { Image } from '../entites/image.entity';
import { NotFoundException } from '@nestjs/common';
import { ImagesController } from '../controller/images.controller';
import { PaginationDTO } from '../../../shared/dtos/pagination.dto';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  const mockImagesService = {
    uploadImage: jest.fn(),
    uploadBullImages: jest.fn(),
    getAllImage: jest.fn(),
    getImageById: jest.fn(),
    deleteImage: jest.fn(),
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
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const mockFile = {
        originalname: 'test.png',
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
        size: 12345,
      } as Express.Multer.File;
      const mockUser = { id: 'user-uuid', username: 'mocker' };
      const mockImage = new Image();

      mockImagesService.uploadImage.mockResolvedValue(mockImage);

      const result = await controller.uploadImage(mockFile, mockUser);

      expect(result).toBe(mockImage);
      expect(service.uploadImage).toHaveBeenCalledWith({
        file: mockFile,
        userId: mockUser.id,
      });
    });
  });

  describe('uploadBullImage', () => {
    it('should upload multiple images', async () => {
      const mockFiles = [
        {
          originalname: 'test1.png',
          buffer: Buffer.from('test1'),
          mimetype: 'image/png',
          size: 12345,
        },
        {
          originalname: 'test2.png',
          buffer: Buffer.from('test2'),
          mimetype: 'image/png',
          size: 12345,
        },
      ] as Express.Multer.File[];
      const mockUser = { id: 'user-uuid', username: 'mocker' };
      const mockImages = [new Image(), new Image()];

      mockImagesService.uploadBullImages.mockResolvedValue(mockImages);

      const result = await controller.uploadBullImage(mockFiles, mockUser);

      expect(result).toBe(mockImages);
      expect(service.uploadBullImages).toHaveBeenCalledWith({
        files: mockFiles,
        userId: mockUser.id,
      });
    });
  });

  describe('getAllImage', () => {
    it('should return paginated images', async () => {
      const paginationDto: PaginationDTO = { page: 1, limit: 10 };
      const mockImages = {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        items: [],
      };

      mockImagesService.getAllImage.mockResolvedValue(mockImages);

      const result = await controller.getAllImage(paginationDto);

      expect(result).toEqual(mockImages);
      expect(service.getAllImage).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('getImageById', () => {
    it('should return an image by id', async () => {
      const mockImage = new Image();
      const mockId = 'some-uuid';

      mockImagesService.getImageById.mockResolvedValue(mockImage);

      const result = await controller.getImageById(mockId);

      expect(result).toBe(mockImage);
      expect(service.getImageById).toHaveBeenCalledWith(mockId);
    });

    it('should throw NotFoundException if image not found', async () => {
      const mockId = 'non-existing-uuid';
      mockImagesService.getImageById.mockRejectedValue(new NotFoundException());

      await expect(controller.getImageById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletedImage', () => {
    it('should delete an image by id', async () => {
      const mockId = 'some-uuid';
      mockImagesService.deleteImage.mockResolvedValue(undefined);

      await controller.deletedImage(mockId);

      expect(service.deleteImage).toHaveBeenCalledWith(mockId);
    });

    it('should throw NotFoundException if image not found', async () => {
      const mockId = 'non-existing-uuid';
      mockImagesService.deleteImage.mockRejectedValue(new NotFoundException());

      await expect(controller.deletedImage(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
