import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  NotFoundException,
  Delete,
  Body,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../aplication/images.service';
import { UploadImageDto } from '../domain/upload-image.dto';
import { RequestUser } from 'src/_shared/domain/request-user';
import { SearchImageDto } from '../domain/search-image.dto';

@Controller('image')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
    @Request() req: RequestUser,
  ): Promise<string> {
    return await this.imageService.uploadImage(
      file,
      uploadImageDto,
      req.user
    );
  }

  @Get(':fileName')
  async getSingleImageUrl(@Param('fileName') fileName: string): Promise<string> {
    try {
      const urls = await this.imageService.checkFileExists(fileName);
      return urls;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error; 
    }
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
