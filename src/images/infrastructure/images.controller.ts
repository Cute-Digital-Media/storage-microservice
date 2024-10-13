import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../aplication/images.service';
import { UploadImageDto } from '../domain/upload-image.dto';
import { RequestUser } from 'src/_shared/domain/request-user';
import { FindOneImageDto } from '../domain/find-one.dto';
import { ImageEntity } from '../domain/image.enity';
import { FindAllDto } from '../domain/find.dto';
import { PaginatedResponse } from 'src/_shared/domain/paginationResponse.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
    @Request() req: RequestUser,
  ): Promise<string> {
    return await this.imageService.uploadImage(file, uploadImageDto, req.user);
  }

  @Get('findOne')
  async findOne(@Query() filter: FindOneImageDto): Promise<ImageEntity> {
    return this.imageService.findOneImage(filter);
  }

  @Get('findAll')
  async findAll(
    @Query() filter: FindAllDto,
  ): Promise<PaginatedResponse<ImageEntity>> {
    return this.imageService.findAllImage(filter);
  }

  @Delete(':fileName')
  async deleteImage(
    @Param('fileName') fileName: string,
    @Body('filePath') filePath: string,
  ): Promise<boolean> {
    console.log(filePath);
    return await this.imageService.deleteFile(fileName, filePath);
  }
}
