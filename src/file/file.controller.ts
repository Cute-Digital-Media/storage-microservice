import { Controller, Get, Post, Param, UseInterceptors, UploadedFiles, Query, ParseUUIDPipe, UseGuards, Req, Delete } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Request } from 'express';

import { FileService } from './file.service';

import { myFileFilter } from './helpers/fileFilters';
import { generateName } from './helpers/generateName';
import { MockJwtAuthGuard } from '../guard/auth.guard';

import { PaginationFileDto } from './dto/pagination-file.dto';
import { UploadFileDto } from './dto/upload-dile.dto';

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
  @ApiOperation({ summary: 'Upload a file - remember to set "mocked-jwt-token" as token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    type: UploadFileDto,
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request|any, // in a real scenario create a decorator to get username is better
  ) {
    return this.fileService.upload(files, req.user.username);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The file UUID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.fileService.findOne(id);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all files paginated' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of files', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset to start retrieving files', example: 0 })
  findAll(@Query() paginationFileDto: PaginationFileDto) {
    return this.fileService.findAll(paginationFileDto);
  }

  @Delete(':id')
  @UseGuards(MockJwtAuthGuard) // remember to send "mocked-jwt-token" as bearer token to test this endpoint
  @ApiOperation({ summary: 'Remove file by ID and apply soft delete, remember to set "mocked-jwt-token" as token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, description: 'The file UUID' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.fileService.remove(id);
  }
}


