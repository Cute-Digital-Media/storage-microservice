import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ImageDto } from './dto/image.dto';
import { ImageFilter } from './filters/image.filter';
import { ImagesService } from './images.service';
import { ResizeImagePipe } from './pipes/resize-image.pipe';

@ApiBearerAuth()
@Controller('images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(@Query() query?: ImageFilter) {
    return await this.imagesService.getAllImages(query);
  }

  @Public()
  @Get('findOne')
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  async getOneImage(@Query('id') id?: string, @Query('name') name?: string) {
    if (id) {
      return await this.imagesService.getImageById(+id);
    } else if (name) {
      return await this.imagesService.getImageByName(name);
    }
    throw new BadRequestException(
      `You must provide at least one of these arguments: 'id' or 'name'`,
    );
  }

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
  async uploadImage(
    @UploadedFile(ResizeImagePipe) resisedImageData: ImageDto,
    @Body() data: ImageDto,
    @Req() request: Request,
  ) {
    const { user_id, tenant } = request['user'];
    data = {
      ...data,
      ...resisedImageData,
      uploadDate: new Date(),
      tenant,
      userId: user_id,
    };
    return await this.imagesService.uploadImage(data);
  }
}
