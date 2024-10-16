import { Test, TestingModule } from '@nestjs/testing';
import { FinAllImage } from '../fin-all-images.usecase';
import { ImageRepository } from '../../../infra/image.repository';
import { LoggerService } from '../../../../../infrastructure/loggers/logger.service';
import { FilterDto } from '../../dtos/filter.dto';
import { Image } from '../../../domain/image.domain';

describe('FinAllImage', () => {
  let finAllImage: FinAllImage;
  let repository: jest.Mocked<ImageRepository>;
  let logger: jest.Mocked<LoggerService>;

  const mockImages: Image[] = [
    {
      id: '1',
      url: 'url1',
      thumbnailUrl: 'thumbnailUrl1',
      size: 1024,
      fileName: 'image1',
      mimeType: 'image/jpeg',
      uploaderByUserId: 'user1',
    },
    {
      id: '2',
      url: 'url2',
      thumbnailUrl: 'thumbnailUrl2',
      size: 2048,
      fileName: 'image2',
      mimeType: 'image/png',
      uploaderByUserId: 'user2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinAllImage,
        {
          provide: ImageRepository,
          useValue: {
            findImages: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    finAllImage = module.get<FinAllImage>(FinAllImage);
    repository = module.get(ImageRepository);
    logger = module.get(LoggerService);
  });

  it('should fetch images successfully', async () => {
    const filterDto: FilterDto = { limit: 10, page: 1 };

    repository.findImages.mockResolvedValue(mockImages as any);

    const result = await finAllImage.execute(filterDto);

    expect(logger.log).toHaveBeenCalledWith(
      'Fetching images with limit: 10 and page: 1',
    );
    expect(repository.findImages).toHaveBeenCalledWith({ limit: 10, page: 1 });
    expect(result).toEqual(mockImages);
    expect(logger.log).toHaveBeenCalledWith('Successfully fetched 2 images');
  });

  it('should handle errors when fetching images', async () => {
    const filterDto: FilterDto = { limit: 10, page: 1 };
    const mockError = new Error('Database error');

    repository.findImages.mockRejectedValue(mockError);

    await expect(finAllImage.execute(filterDto)).rejects.toThrow(mockError);

    expect(logger.log).toHaveBeenCalledWith(
      'Fetching images with limit: 10 and page: 1',
    );
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch images. Error: Database error',
    );
  });
});
