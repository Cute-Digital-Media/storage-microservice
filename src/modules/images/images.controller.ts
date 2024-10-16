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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { User } from '../users/domain/user.domain';
import { Image } from './domain/image.domain';
import { ImagesService } from './images.service';
import { FilterDto } from './app/dtos/filter.dto';
import { User as GetUser } from '../../infrastructure/decorators/user.decorator';
import { JwtMockGuard } from '../../infrastructure/guards/jwt-auth.guard';

@Controller('images')
@UseGuards(JwtMockGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    //Se usa el decorador para simular un usuario autenticado
    @GetUser() user: User,
  ): Promise<Image> {
    return this.imagesService.upload(file, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve paginated list of images' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved images',
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  async getAllImage(@Query() paginationDto: FilterDto) {
    return this.imagesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved image',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async findByIdImage(@Param('id', ParseUUIDPipe) id: string): Promise<Image> {
    return this.imagesService.findByIdImage(id);
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
    return this.imagesService.deleted(id);
  }
}
