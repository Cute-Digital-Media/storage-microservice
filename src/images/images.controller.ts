import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ImageDto } from './dto/image.dto';
import { ImagesService } from './images.service';
import { FileInfo } from './pipes/file-info';
import { SharpPipe } from './pipes/sharp.pipe';

@Controller('images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(SharpPipe) fileInfo: FileInfo,
    @Body() imageDto: ImageDto,
  ) {
    imageDto.fileInfo = fileInfo;
    imageDto.uploadDate = new Date();
    return await this.imagesService.uploadImage(imageDto);
  }
}
