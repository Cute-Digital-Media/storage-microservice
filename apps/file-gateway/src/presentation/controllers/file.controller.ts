import { Controller, Get, Post, Body, Patch, Param, Delete, NotImplementedException } from '@nestjs/common';
import { CreateFileDto } from 'apps/file-gateway/src/application/features/file/commands/create/file.create.dto.command';
import { UpdateFileDto } from 'apps/file-gateway/src/application/features/file/commands/update/file.update.dto';

@Controller('file')
export class FileController {
  constructor(
  ) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    throw new NotImplementedException()
  }

  @Get()
  findAll() {
    throw new NotImplementedException()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    throw new NotImplementedException()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    throw new NotImplementedException()
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new NotImplementedException()
  }
}
