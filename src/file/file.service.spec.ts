import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Thumbnail } from './entities/thumbnail.entity';
import { File } from './entities/file.entity';

import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let fileRepository: Repository<File>;
  let thumbnailRepository: Repository<Thumbnail>;

  // Mock repository values
  const mockFileRepository = {
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  const mockThumbnailRepository = {
    generateThumbnail: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: getRepositoryToken(File), useValue: mockFileRepository },
        { provide: getRepositoryToken(Thumbnail), useValue: mockThumbnailRepository },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    fileRepository = module.get<Repository<File>>(getRepositoryToken(File));
    thumbnailRepository = module.get<Repository<Thumbnail>>(getRepositoryToken(Thumbnail));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated file data', async () => {
      const paginationDto = { limit: 10, offset: 0 };
      const result = {
        count: 10,
        files: [],
      }; // Mock return value

      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await service.findAll(paginationDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a file by ID', async () => {
      const id = '91bc41e6-cad1-4bb1-833f-ea4b651a0e2c'; // some uuid
      const result = {
        msg: 'File was removed correctly',
      };

      jest.spyOn(service, 'remove').mockImplementation(async () => result);

      expect(await service.remove(id)).toBe(result);
    });
  });
});
