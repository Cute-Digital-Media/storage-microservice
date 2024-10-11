import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ImagesService } from '../services/images.service';
import { PaginationDTO } from '../../../shared/dtos/pagination.dto';
import { Image } from '../entites/image.entity';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import {
  ApiUploadImage,
  ApiUploadBullImages,
} from '../../../shared/decorators/swagger-file.decorator';
import { UserMocker } from '../../../interface/user-mocker';
import { User } from '../../../shared/decorators/user.decorator';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @ApiUploadImage()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserMocker,
  ): Promise<Image> {
    return this.imagesService.uploadImage({ file, userId: user.id });
  }

  @Post('upload-bull')
  @ApiUploadBullImages()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadBullImage(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserMocker,
  ) {
    return this.imagesService.uploadBullImages({ files, userId: user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve paginated list of images' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved images',
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  async getAllImage(@Query() paginationDto: PaginationDTO) {
    return this.imagesService.getAllImage(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved image',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async getImageById(@Param('id', ParseUUIDPipe) id: string): Promise<Image> {
    return this.imagesService.getImageById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image by ID' })
  @ApiResponse({
    status: 204,
    description: 'Image deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @HttpCode(204)
  async deletedImage(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.imagesService.deleteImage(id);
  }
}
