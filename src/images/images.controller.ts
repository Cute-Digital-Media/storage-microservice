import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ImageDto } from './dto/image.dto';
import { ImagesService } from './images.service';
import { ResizeImagePipe } from './pipes/resize-image.pipe';

@ApiBearerAuth()
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
        searchableFileName: { type: 'string', default: 'Test Image' },
        folderName: { type: 'string', default: 'images' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(ResizeImagePipe) resisedImageData: ImageDto,
    @Body() data: ImageDto,
  ) {
    data = { ...data, ...resisedImageData, uploadDate: new Date() };
    return await this.imagesService.uploadImage(data);
  }
}
