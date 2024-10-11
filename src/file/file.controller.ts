import { Controller, Get, Post, Param, UseInterceptors, UploadedFiles, Query, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

import { FileService } from './file.service';

import { myFileFilter } from './helpers/fileFilters';
import { generateName } from './helpers/generateName';
import { MockJwtAuthGuard } from '../guard/auth.guard';

import { PaginationFileDto } from './dto/pagination-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseGuards(MockJwtAuthGuard) // you have to send request header with Bearer token like this: mocked-jwt-token
  @UseInterceptors( FilesInterceptor('files', 3, {
    fileFilter: myFileFilter,
    storage: diskStorage({
      destination: './uploads',
      filename: generateName
    })
  }))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request|any, // in a real scenario create a decorator to get username is better
  ) {
    return this.fileService.create(files, req.user.username);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.fileService.findOne(id);
  }

  @Get('')
  findAll(@Query() paginationFileDto: PaginationFileDto) {
    return this.fileService.findAll(paginationFileDto);
  }
}


