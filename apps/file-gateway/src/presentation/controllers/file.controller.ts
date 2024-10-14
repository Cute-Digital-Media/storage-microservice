import { Controller, Get, Post, Body, Patch, Param, Delete, NotImplementedException, UseInterceptors, UploadedFile, Inject, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileDto } from 'apps/file-gateway/src/application/features/file/commands/create/file.create.dto.command';
import { UpdateFileDto } from 'apps/file-gateway/src/application/features/file/commands/update/file.update.dto';
import { CreateFileCommand } from '../../application/features/file/commands/create/file.create.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggerService } from '../../application/services/ilogger.service';
import { Result } from 'libs/common/application/base';
import { FileEntity } from '../../domain/entities/file.entity';
import { GetTokenUser } from 'libs/common/presentation/auth/decorators/get-user.decorator';
import { GetOneFileQuery } from '../../application/features/file/queries/get-one/file.get-one.query';
import { FileModel } from '../../domain/models/file.model';
import { GetOneFileDto } from '../../application/features/file/queries/get-one/file.get-one.dto';
import { Response } from 'express';
import { memoryStorage } from 'multer';

@Controller('file')
export class FileController {
  constructor(
    private readonly queryBus: QueryBus, 
    private readonly commandBus: CommandBus, 
    @Inject("ILoggerService")
    private readonly logger: LoggerService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @GetTokenUser('sub') userId: string, 
    @Body() dto : CreateFileDto
  ) {
    
    if (!file) {
      this.logger.error(`No file found in upload file attempt.`)
      return { success: false , message: "File missing"}
    }
    const fileBuffer = file.buffer;
    const result = await this.commandBus.execute<CreateFileCommand,Result<FileEntity>>(
      new CreateFileCommand(
        file.originalname,
        file.size,
        file.mimetype,
        fileBuffer,
        dto,
        userId,
      )
    );
    return result; 
  }

  @Get()
  findAll() {
    throw new NotImplementedException()
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const ans = await this.queryBus.execute<GetOneFileQuery, Result<FileModel>>(
      new GetOneFileQuery(new GetOneFileDto(id), "userId")
    );
    if(ans.isFailure)
    {
      return ans.unwrapError();
    }
    const file = ans.unwrap();    
    res.setHeader('Content-Type', file.contentType);
    return res.send(file.file);    

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
