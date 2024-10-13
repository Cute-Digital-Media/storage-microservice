import { Controller, Get, Post, Body, Patch, Param, Delete, NotImplementedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileDto } from 'apps/file-gateway/src/application/features/file/commands/create/file.create.dto.command';
import { UpdateFileDto } from 'apps/file-gateway/src/application/features/file/commands/update/file.update.dto';
import { CreateFileCommand } from '../../application/features/file/commands/create/file.create.command';

@Controller('file')
export class FileController {
  constructor(
    private readonly queryBus: QueryBus, 
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  async create(@Body() createFileDto: CreateFileDto) {
    return await this.commandBus.execute(new CreateFileCommand(createFileDto,"userid"))
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
