import { User } from 'src/modules/users/domain/user.domain';
import { Image } from '../../domain/image.domain';

export const getMockUser = (): User => ({
  id: 'user-uuid',
  email: 'john@example.com',
});

export const getMockFile = (): Express.Multer.File => ({
  fieldname: 'file',
  originalname: 'test-image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 5000,
  buffer: Buffer.from('mock file'),
  stream: undefined,
  destination: undefined,
  filename: undefined,
  path: undefined,
});

export const getMockImage = (): Image => ({
  id: 'image-uuid',
  fileName: 'test-image.jpg',
  url: 'http://test.com/image.jpg',
  thumbnailUrl: 'http://test.com/thumbnail.jpg',
  thumbnailFileName: 'thumbnail-test-image.jpg',
  mimeType: 'image/jpeg',
  size: 5000,
  uploaderByUserId: 'user-uuid',
});
