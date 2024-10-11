import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import {
  ResponseData,
  ResponseMessage,
} from 'src/@common/interfaces/response.interface';
import { FirebaseConfig } from 'src/firebase/firebase.config';
import { PassThrough } from 'stream';
import { Image } from './entities/image.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryGetAllImagesDto } from './dto/query-get-all-images.dto';
import { Readable } from 'typeorm/platform/PlatformTools';
import sharp from 'sharp';

@Injectable()
export class ImagesService {
  constructor(
    private readonly firebaseConfig: FirebaseConfig,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<ResponseData> {
    try {
      if (!file) {
        return ResponseMessage({
          status: 400,
          message: 'File is required',
        });
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.mimetype)) {
        return ResponseMessage({
          status: 400,
          message: 'Unsupported file type',
        });
      }

      if (file.size / 1048576 > 10) {
        return ResponseMessage({
          status: 400,
          message: 'Unsupported file size, file must be less than 10mb',
        });
      }

      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) {
        return ResponseMessage({
          status: 404,
          message: 'User not found',
        });
      }

      const filename = file.originalname;
      const blob = this.firebaseConfig.bucket.file(`images/${filename}`);

      const stream = new PassThrough();

      stream.end(file.buffer);

      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(blobStream)
          .on('error', (error) => reject(error))
          .on('finish', resolve);
      });

      const publicUrl = `https://storage.googleapis.com/${this.firebaseConfig.bucket.name}/${blob.name}`;

      const thumbnailBuffer = await sharp(file.buffer)
        .resize(150, 150)
        .toBuffer();

      const thumbnailFileName = `thumbnail_${file.originalname}`;
      const thumbnailFile = this.firebaseConfig.bucket.file(
        `thumbnails/${thumbnailFileName}`,
      );

      const thumbnailStream = Readable.from(thumbnailBuffer);

      const blobStreamThumbnail = thumbnailFile.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      await new Promise<void>((resolve, reject) => {
        thumbnailStream
          .pipe(blobStreamThumbnail)
          .on('error', (error) => reject(error))
          .on('finish', resolve);
      });

      const thumbnailUrl = `https://storage.googleapis.com/${this.firebaseConfig.bucket.name}/${thumbnailFileName}`;

      const image = await this.imagesRepository.create({
        name: filename,
        url: publicUrl,
        thumbnailUrl,
        user,
      });

      this.imagesRepository.save(image);

      return ResponseMessage({
        status: 201,
        data: image,
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async getAllImages(query: QueryGetAllImagesDto) {
    try {
      const { name, username, page, limit } = query;
      const where: any = {};
      if (name) where.name = Like(`%${name}%`);
      if (username) where.user = { username: Like(`%${username}%`) };

      const [images, total] = await this.imagesRepository.findAndCount({
        where,
        relations: ['user'],
        take: limit || null,
        skip: page && limit ? (page - 1) * limit : null,
      });
      return ResponseMessage({
        status: 200,
        data: { items: images, total, page, limit },
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async getImageById(id: number) {
    try {
      const image = await this.imagesRepository.find({
        where: { id },
        relations: ['user'],
      });
      return ResponseMessage({
        status: 200,
        data: image,
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }

  async deleteImage(id: number) {
    try {
      const result = await this.imagesRepository.delete(id);

      if (result.affected === 0) {
        return ResponseMessage({
          status: 404,
          message: 'Image not found',
        });
      }
      return ResponseMessage({
        status: 200,
        message: 'Image successfully deleted',
      });
    } catch (error) {
      return ResponseMessage({
        status: 500,
        message: error.toString() || 'An internal error has occurred.',
      });
    }
  }
}
