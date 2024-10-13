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
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../aplication/images.service';
import { UploadImageDto } from '../domain/upload-image.dto';
import { RequestUser } from 'src/_shared/domain/request-user';
import { FindOneImageDto } from '../domain/find-one.dto';
import { ImageEntity } from '../domain/image.enity';
import { FindAllDto } from '../domain/find.dto';
import { PaginatedResponse } from 'src/_shared/domain/paginationResponse.dto';
import { multerConfig } from '../domain/multer.config';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSwagger } from 'src/_shared/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/swagger/http.swagger';

const controllerName = 'Images';

@ApiTags('Images')
@Controller({
  path: 'images',
  version: '1',
})
@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(null, controllerName))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
    @Request() req: RequestUser,
  ): Promise<string> {
    return await this.imageService.uploadImage(file, uploadImageDto, req.user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ImageEntity, controllerName))
  @Get('findOne')
  async findOne(@Query() filter: FindOneImageDto): Promise<ImageEntity> {
    return this.imageService.findOneImage(filter);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ImageEntity, controllerName))
  @Get('findAll')
  async findAll(
    @Query() filter: FindAllDto,
  ): Promise<PaginatedResponse<ImageEntity>> {
    return this.imageService.findAllImage(filter);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(null, controllerName))
  @Delete('fileName/:id')
  async deleteImage(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.imageService.deleteImage(id);
  }
}
