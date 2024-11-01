import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Public } from '../auth/decorators/public.decorator';
import { ImageDto } from './dto/image.dto';
import { ImagesService } from './images.service';
import { PaginationDto } from './pagination/pagination.dto';
import { ResizeImagePipe } from './pipes/resize-image.pipe';

@ApiBearerAuth()
@Controller('images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(@Query() query?: PaginationDto) {
    return await this.imagesService.getAllImages(query);
  }

  @Public()
  @Get('findOne')
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiProduces('image/webp')
  async getOneImage(
    @Res() res: Response,
    @Query('id') id?: string,
    @Query('name') name?: string,
  ) {
    if (!id && !name) {
      throw new BadRequestException(
        `You must provide at least one of these arguments: 'id' or 'name'`,
      );
    }
    let imageDto = null;
    if (id) {
      imageDto = await this.imagesService.getImageById(+id);
    } else if (name) {
      imageDto = await this.imagesService.getImageByName(name);
    }

    const buffer: any = imageDto.buffer;
    const mimeType = 'image/webp';
    const b64 = Buffer.from(buffer.data, 'base64');
    res.contentType(mimeType);
    res.attachment(`${imageDto.firebaseFileName}.webp`);
    res.send(b64);
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
    const uuid = uuidv4();
    data = {
      ...data,
      ...resisedImageData,
      uploadDate: new Date(),
      firebaseFileName: `${resisedImageData.originalFileName}-${uuid}`,
      tenant,
      userId: user_id,
    };
    return await this.imagesService.uploadImage(data);
  }

  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return await this.imagesService.deleteImage(id);
  }
}
