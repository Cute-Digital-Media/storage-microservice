import { NotFoundException } from '@nestjs/common';
import { DeletedImage } from '../deleted-image.usecase';
import { ImageRepository } from '../../../infra/image.repository';
import { StorageService } from '../../../../storage/storage.service';
import { LoggerService } from '../../../../../infrastructure/loggers/logger.service';
import { ImageEntity } from '../../../infra/entity/image.entity';

describe('DeletedImage', () => {
  let deletedImage: DeletedImage;
  let repository: ImageRepository;
  let storageService: StorageService;
  let logger: LoggerService;

  const mockImage: ImageEntity = {
    id: 'mock-id',
    url: 'https://storage.googleapis.com/bucket/test-image.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bucket/thumbnail-test-image.png',
    fileName: 'test-image',
    thumbnailFileName: 'thumbnail-test-image',
    mimeType: 'image/png',
    size: 1024,
    uploaderByUserId: 'mock-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = {
      finById: jest.fn(),
      deleteImage: jest.fn(),
    } as any;

    storageService = {
      deletedImageToStorage: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    deletedImage = new DeletedImage(repository, storageService, logger);
  });

  it('should delete an image successfully', async () => {
    (repository.finById as jest.Mock).mockResolvedValue(mockImage);
    (storageService.deletedImageToStorage as jest.Mock).mockResolvedValue(
      undefined,
    );
    (repository.deleteImage as jest.Mock).mockResolvedValue(true);

    const result = await deletedImage.execute('mock-id');

    expect(logger.log).toHaveBeenCalledWith(
      'Attempting to delete image with ID: mock-id',
    );
    expect(repository.finById).toHaveBeenCalledWith('mock-id');
    expect(storageService.deletedImageToStorage).toHaveBeenCalledWith(
      'test-image',
    );
    expect(storageService.deletedImageToStorage).toHaveBeenCalledWith(
      'thumbnail-test-image',
    );
    expect(repository.deleteImage).toHaveBeenCalledWith('mock-id');
    expect(logger.log).toHaveBeenCalledWith(
      'Image with ID: mock-id successfully deleted from database',
    );
    expect(result).toEqual(true);
  });

  it('should throw NotFoundException if the image is not found', async () => {
    (repository.finById as jest.Mock).mockResolvedValue(null);

    await expect(deletedImage.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(logger.warn).toHaveBeenCalledWith(
      'Image with ID: non-existent-id not found',
    );
    expect(repository.finById).toHaveBeenCalledWith('non-existent-id');
    expect(storageService.deletedImageToStorage).not.toHaveBeenCalled();
    expect(repository.deleteImage).not.toHaveBeenCalled();
  });

  it('should log an error if deleting the image fails', async () => {
    (repository.finById as jest.Mock).mockResolvedValue(mockImage);
    (storageService.deletedImageToStorage as jest.Mock).mockRejectedValue(
      new Error('Deletion failed'),
    );

    await expect(deletedImage.execute('mock-id')).rejects.toThrow(
      'Deletion failed',
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to delete image with ID: mock-id. Error: Deletion failed',
    );
    expect(repository.deleteImage).not.toHaveBeenCalled();
  });
});
