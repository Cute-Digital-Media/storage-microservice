import { BadRequestException } from '@nestjs/common';
import { UploadImage } from '../upload-image.usecase';
import { ImageRepository } from '../../../infra/image.repository';
import { StorageService } from '../../../../storage/storage.service';
import { LoggerService } from '../../../../../infrastructure/loggers/logger.service';
import { UploadFileDto } from '../../dtos/upload-file.dto';

jest.mock('sharp');

describe('UploadImage', () => {
  let uploadImage: UploadImage;
  let repository: jest.Mocked<ImageRepository>;
  let storageService: jest.Mocked<StorageService>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
    } as any;

    storageService = {
      uploadImageToStorage: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    uploadImage = new UploadImage(repository, storageService, logger);
  });

  it('should throw a BadRequestException if no file is provided', async () => {
    const uploadFileDto: UploadFileDto = { file: null, userId: 'mock-user-id' };

    await expect(uploadImage.execute(uploadFileDto)).rejects.toThrow(
      new BadRequestException('No file provided'),
    );
    expect(logger.warn).toHaveBeenCalledWith('Upload attempt without a file');
  });

  it('should throw a BadRequestException if the file type is not allowed', async () => {
    const mockFile = {
      originalname: 'test-file.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from('mock file buffer'),
      size: 1024,
    } as Express.Multer.File;

    const uploadFileDto: UploadFileDto = {
      file: mockFile,
      userId: 'mock-user-id',
    };

    await expect(uploadImage.execute(uploadFileDto)).rejects.toThrow(
      new BadRequestException('File type not allowed'),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      'File type not allowed: text/plain',
    );
  });

  it('should throw a BadRequestException if the file exceeds the maximum allowed size', async () => {
    const mockFile = {
      originalname: 'large-image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('mock file buffer'),
      size: 6 * 1024 * 1024, // 6 MB
    } as Express.Multer.File;

    const uploadFileDto: UploadFileDto = {
      file: mockFile,
      userId: 'mock-user-id',
    };

    await expect(uploadImage.execute(uploadFileDto)).rejects.toThrow(
      new BadRequestException('The file exceeds the maximum allowed size'),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      `File exceeds maximum size: ${mockFile.size} bytes, user: mock-user-id`,
    );
  });

  it('should log an error and throw an exception if upload fails', async () => {
    const mockFile = {
      originalname: 'test-image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('mock file buffer'),
      size: 1024,
    } as Express.Multer.File;

    const uploadFileDto: UploadFileDto = {
      file: mockFile,
      userId: 'mock-user-id',
    };

    const mockError = new Error('Failed to upload to storage');

    storageService.uploadImageToStorage.mockRejectedValueOnce(mockError);

    await expect(uploadImage.execute(uploadFileDto)).rejects.toThrow(mockError);
    expect(logger.error).toHaveBeenCalledWith(
      `Failed to upload image, error: ${mockError.message}`,
    );
  });
});
