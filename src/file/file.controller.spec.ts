import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';

import { FileModule } from './file.module';
import { FileService } from './file.service';

import { Thumbnail } from './entities/thumbnail.entity';
import { File } from './entities/file.entity';

describe('FileController (e2e)', () => {
  let app: INestApplication;
  let fileService = { 
    upload: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  const mockFileRepository = {
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockThumbnailRepository = {
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FileModule],
    })
    .overrideProvider(FileService) // Mock the service
    .useValue(fileService)
    .overrideProvider(getRepositoryToken(File)) // Mock FileRepository
    .useValue(mockFileRepository)
    .overrideProvider(getRepositoryToken(Thumbnail)) // Mock ThumbnailRepository
    .useValue(mockThumbnailRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST upload (should upload a file)', () => {
    const mockFile = Buffer.from('This is a test file content'); // Mock file content

    fileService.upload.mockResolvedValueOnce({
      msg: 'File uploaded successfully',
    });

    return request(app.getHttpServer())
      .post('/file/upload')
      .set('Authorization', 'Bearer mocked-jwt-token') // Mocked JWT token for authentication
      .attach('files', mockFile, 'test-image.png') // Simulate file upload
      .expect(201)
      .expect({
        msg: 'File uploaded successfully',
      });
  });

  it('/GET files (should return paginated files)', () => {
    const pagination = { limit: 10, offset: 0 };
    fileService.findAll.mockResolvedValueOnce([]);

    return request(app.getHttpServer())
      .get('/file')
      .query(pagination)
      .expect(200)
      .expect([]);
  });

  it('/DELETE file/:id (should remove file by ID)', () => {
    const id = '91bc41e6-cad1-4bb1-833f-ea4b651a0e2c';
    fileService.remove.mockResolvedValueOnce({ affected: 1 });

    return request(app.getHttpServer())
      .delete(`/file/${id}`)
      .set('Authorization', 'Bearer mocked-jwt-token') // Mocked JWT token for authentication
      .expect(200)
      .expect({ affected: 1 });
  });

  it('/DELETE files/:id (should return forbidden if token is invalid)', () => {
    const id = '91bc41e6-cad1-4bb1-833f-ea4b651a0e2c';

    return request(app.getHttpServer())
      .delete(`/file/${id}`)
      .set('Authorization', 'Bearer invalid-token') // Invalid token
      .expect(403);
  });
});
