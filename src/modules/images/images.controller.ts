import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe, Patch,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileInterceptor } from './app/interceptors/file.interceptor';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../config/auth/app/guards/jwtGuards';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(
    @Inject(ImagesService) private readonly service: ImagesService,
  ) {}
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    UploadFileInterceptor,
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.service.create(file);
  }
  @Get('/:id')
  async get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.service.show(id);
  }
  @Get()
  async index(){
    return this.service.index();
  }
  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.service.delete(id);
  }
  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    UploadFileInterceptor,
  )
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @UploadedFile() file: Express.Multer.File) {
    return await this.service.update(id, file);
  }
}
