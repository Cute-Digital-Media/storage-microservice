import { FirebaseRepository } from 'src/firebase/firebase.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { PageOptionsDto } from './dto/page.options.dto';
import { PageDto } from './dto/page.dto';
import { PageMetaDto } from './metadata/metadata.patameters';
import * as sharp from 'sharp';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ImagesService {
  private logger = new Logger('ImagesService');

  constructor(
    private readonly firebaseRepository: FirebaseRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async saveImageAndThumbnail(file, user: UserActiveInterface) {
    await this.uploadImage(file, user);
    const thumbnail = sharp(file.buffer).resize(200, 200);
    const thumbnailFileName = `thumbnail/${file.originalname}`;
    const thumbnailFile = {
      buffer: await thumbnail.toBuffer(),
      mimetype: file.mimetype,
      originalname: thumbnailFileName,
    };
    await this.uploadImage(thumbnailFile, user);
  }

  async uploadImage(file, user: UserActiveInterface): Promise<string> {
    const storage = this.firebaseRepository.storageInstance;
    const bucket = storage.bucket();

    const fileName = `${user.tenant}/${user.id}/${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });

      stream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(fileName)}?alt=media`;
        resolve(publicUrl);
      });
      stream.end(file.buffer);
    });
  }

  async getImageUrl(
    fileName: string,
    user: UserActiveInterface,
  ): Promise<string> {
    const cacheKey = `image-${user.tenant}-${user.id}-${fileName}`;
    const cachedUrl = (await this.cacheService.get(cacheKey)) as string;
    if (cachedUrl) {
      this.logger.log('Returning cached image url');
      return cachedUrl;
    }

    const storage = this.firebaseRepository.storageInstance;
    const bucket = storage.bucket();
    const fileNameTenant = `${user.tenant}/${user.id}/${fileName}`;

    const file = bucket.file(fileNameTenant);
    const imageExists = await file.exists();
    if (!imageExists[0]) {
      throw new Error('Image not found');
    }
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60,
    });

    await this.cacheService.set(cacheKey, url);
    return url;
  }

  async getAllImagesUrlWithPagination(
    pageOptionsDto: PageOptionsDto,
    user: UserActiveInterface,
  ): Promise<PageDto<string>> {
    const storage = this.firebaseRepository.storageInstance;
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({
      prefix: `${user.tenant}/${user.id}/`,
    });

    const urls = await Promise.all(
      files.map(async (file) => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60,
        });
        return url;
      }),
    );

    const itemCount = urls.length;
    const { take, page } = pageOptionsDto;
    const start = (page - 1) * take;
    const end = start + take;
    const data = urls.slice(start, end);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async deleteImage(
    fileName: string,
    user: UserActiveInterface,
  ): Promise<void> {
    const storage = this.firebaseRepository.storageInstance;
    const bucket = storage.bucket();
    const fileNameTenant = `${user.tenant}/${user.id}/${fileName}`;

    const file = bucket.file(fileNameTenant);
    const imageExists = await file.exists();
    if (!imageExists[0]) {
      throw new Error('Image not found');
    }
    await file.delete();
  }

  // async generateThumbnailImage(file, user: UserActiveInterface) {
  //   const storage = this.firebaseRepository.storageInstance;
  //   const bucket = storage.bucket();

  //   const fileName = `${user.tenant}/${user.id}/${file.originalname}`;
  //   const fileUpload = bucket.file(fileName);

  //   const stream = fileUpload.createWriteStream({
  //     metadata: {
  //       contentType: file.mimetype,
  //     },
  //     resumable: false,
  //   });

  //   return new Promise((resolve, reject) => {
  //     stream.on('error', (err) => {
  //       reject(err);
  //     });

  //     stream.on('finish', async () => {
  //       const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(fileName)}?alt=media`;
  //       const thumbnailFileName = `${user.tenant}/${user.id}/thumbnail/${file.originalname}`;
  //       const thumbnailFileUpload = bucket.file(thumbnailFileName);

  //       const thumbnailStream = thumbnailFileUpload.createWriteStream({
  //         metadata: {
  //           contentType: file.mimetype,
  //         },
  //         resumable: false,
  //       });

  //       thumbnailStream.on('error', (err) => {
  //         reject(err);
  //       });

  //       thumbnailStream.on('finish', async () => {
  //         const publicThumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(thumbnailFileName)}?alt=media`;
  //         resolve({ publicUrl, publicThumbnailUrl });
  //       });

  //       const thumbnailStreamTransform = sharp().resize(200, 200);
  //       stream.pipe(thumbnailStreamTransform).pipe(thumbnailStream);
  //     });
  //     stream.end(file.buffer);
  //   });
  // }
}
