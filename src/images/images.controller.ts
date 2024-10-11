import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ResponseData } from 'src/@common/interfaces/response.interface';
import { AuthGuard } from 'src/@common/guards/auth.guard';
import { QueryGetAllImagesDto } from './dto/query-get-all-images.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('images')
@ApiTags('Image')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image(login required)' })
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<ResponseData> {
    try {
      const user = request['user'];
      const response = await this.imagesService.uploadImage(file, +user.id);
      if (
        response.status &&
        response.message &&
        (response.status < 200 || response.status > 399)
      ) {
        throw new HttpException(response.message, response.status);
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all images' })
  async getAllImages(
    @Query() query: QueryGetAllImagesDto,
  ): Promise<ResponseData> {
    try {
      const response = await this.imagesService.getAllImages(query);
      if (
        response.status &&
        response.message &&
        (response.status < 200 || response.status > 399)
      ) {
        throw new HttpException(response.message, response.status);
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get image by id' })
  async getImageById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData> {
    try {
      const response = await this.imagesService.getImageById(id);
      if (
        response.status &&
        response.message &&
        (response.status < 200 || response.status > 399)
      ) {
        throw new HttpException(response.message, response.status);
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete image' })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await this.imagesService.deleteImage(id);
      if (
        response.status &&
        response.message &&
        (response.status < 200 || response.status > 399)
      ) {
        throw new HttpException(response.message, response.status);
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
