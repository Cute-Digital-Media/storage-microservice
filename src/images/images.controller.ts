import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Inject,
  Request,
  Patch,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheTTL,
  Cache,
  CacheKey,
} from 'nestjs-cache-manager-v6';

import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoggerService } from 'src/logs/logger.service';

@UseGuards(JwtAuthGuard)
@ApiTags('IMAGES')
@ApiBearerAuth()
@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly loggerService: LoggerService,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'The maximum allowed file size is 5 MB.',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ): Promise<Image> {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const user = await lastValueFrom(
        this.authService.send('validate_token', token),
      );
      const userId = user.id;
      this.loggerService.log(
        `User with id ${userId} is uploading the image -> ${file.originalname}`,
      );
      const image = await this.imagesService.uploadImage(file, userId);
      await this.cacheManager.del('getAllImages');
      this.loggerService.log(
        `Image uploaded successfully: ${file.originalname}`,
      );
      return image;
    } catch (error) {
      this.loggerService.error('Error uploading image', error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an image by id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'New image file to update',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'The maximum allowed file size is 5 MB.',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ): Promise<Image> {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const user = await lastValueFrom(
        this.authService.send('validate_token', token),
      );
      const userId = user.id;

      this.loggerService.log(
        `User with id ${userId} is updating the image -> ${file.originalname}`,
      );

      const updatedImage = await this.imagesService.updateImage(id, file);

      await this.cacheManager.del('getAllImages');

      this.loggerService.log(
        `Image updated successfully: ${file.originalname}`,
      );

      return updatedImage;
    } catch (error) {
      this.loggerService.error('Error updating image', error);
    }
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an image by id' })
  @Get(':id')
  async getImage(@Param('id') id: string): Promise<Image> {
    try {
      this.loggerService.log(`Getting image: ${id}`);
      const image = await this.imagesService.getImage(id);
      this.loggerService.log(`Image obtained successfully: ${id}`);
      return image;
    } catch (error) {
      this.loggerService.error('Error getting image', error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all images in the bucket' })
  @ApiBearerAuth()
  @CacheKey('getAllImages')
  @CacheTTL(600)
  async getAllImages(): Promise<Image[]> {
    try {
      return this.imagesService.getAllImages();
    } catch (error) {
      this.loggerService.error('Error getting all images', error);
    }
  }

  @ApiOperation({ summary: 'Delete an image' })
  @ApiBearerAuth()
  @Delete(':id')
  async deleteImage(@Param('id') id: string): Promise<void> {
    try {
      this.loggerService.log(`Deleting image: ${id}`);
      await this.imagesService.deleteImage(id);
      await this.cacheManager.del('getAllImages');
      this.loggerService.log(`Image deleted successfully: ${id}`);
    } catch (error) {
      this.loggerService.error('Error deleting image', error);
    }
  }
}
