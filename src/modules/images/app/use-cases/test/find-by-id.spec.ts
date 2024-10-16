import { NotFoundException } from '@nestjs/common';
import { FindById } from '../find-by-id.usecase';
import { ImageRepository } from '../../../infra/image.repository';
import { LoggerService } from '../../../../../infrastructure/loggers/logger.service';
import { ImageEntity } from '../../../infra/entity/image.entity';

describe('FindById', () => {
  let findById: FindById;
  let repository: ImageRepository;
  let logger: LoggerService;

  const mockImage: ImageEntity = {
    id: 'mock-id',
    url: 'https://storage.googleapis.com/bucket/test-image.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bucket/thumbnail-test-image.png',
    thumbnailFileName: 'thumbnail-test-image',
    fileName: 'test-image',
    mimeType: 'image/png',
    size: 1024,
    uploaderByUserId: 'mock-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = {
      finById: jest.fn(), // Mockear la función finById
    } as any;

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
    } as any;

    findById = new FindById(repository, logger);
  });

  it('should fetch an image by ID successfully', async () => {
    (repository.finById as jest.Mock).mockResolvedValue(mockImage);

    const result = await findById.execute('mock-id');

    expect(logger.log).toHaveBeenCalledWith('Fetching images by id:mock-id');
    expect(repository.finById).toHaveBeenCalledWith('mock-id');
    expect(result).toEqual(mockImage);
    expect(logger.log).toHaveBeenCalledWith(
      'Successfully fetched  image with id:mock-id',
    );
  });

  it('should throw NotFoundException if image is not found', async () => {
    (repository.finById as jest.Mock).mockResolvedValue(null);

    await expect(findById.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(logger.log).toHaveBeenCalledWith(
      'Fetching images by id:non-existent-id',
    );
    expect(logger.warn).toHaveBeenCalledWith(
      'Image with ID: non-existent-id not found',
    );
    expect(repository.finById).toHaveBeenCalledWith('non-existent-id');
  });
});
