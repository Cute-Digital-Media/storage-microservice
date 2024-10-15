import { Controller, Get, Post, Body, Patch, Param, Delete, NotImplementedException, UseInterceptors, UploadedFile, Inject, Res, Query, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileDto } from 'apps/file-gateway/src/application/features/file/commands/create/file.create.dto.command';
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
import { GetAllFilesQuery } from '../../application/features/file/queries/get-all/file.get-all.query';
import { PaginationDto } from 'libs/common/presentation/dtos/pagination.dto';
import { GetAllFilesDto } from '../../application/features/file/queries/get-all/file.get-all.dto';
import { DeleteFileCommand } from '../../application/features/file/commands/delete/file.delete.command';
import { GetThumbnailQuery } from '../../application/features/file/queries/get-thumbnail/file.get-thumbnail.query';
import { GetThumbnailDto } from '../../application/features/file/queries/get-thumbnail/file.get-thumbnail.dto';

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
        userId
      )
    );
    return result; 
  }

  @Post("/all")
  async getAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Body() filter: GetAllFilesDto, 
    @GetTokenUser('sub') userId: string, 
    @Res() res: Response, 
  ) {
    if(!page || !limit)
    {
      return res.status(HttpStatus.BAD_REQUEST).send({error: "Missing pagination."});
    }

    const ans = await this.queryBus.execute<GetAllFilesQuery,Result<never>>(      
      new GetAllFilesQuery(
        userId,
        false, 
        filter,
        new PaginationDto(limit,page)
      ) 
    );

    if (ans.isFailure) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ans);
    }

    const files = ans.unwrap();
    return res.status(HttpStatus.OK).send(files);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetTokenUser('sub') userId: string, 
    @Res() res: Response
  ) {
    const ans = await this.queryBus.execute<GetOneFileQuery, Result<FileModel>>(
      new GetOneFileQuery(new GetOneFileDto(id), userId)
    );
    
    if (ans.isFailure) {
      return res.send(ans);
    }

    const file = ans.unwrap();    
    res.setHeader('Content-Type', file.contentType);
    return res.send(file.file);    
  }

  @Get('thumbnail/:id')
  async findThumbNail(
    @Param('id') id: string,
    @GetTokenUser('sub') userId: string, 
    @Res() res: Response
  ) {
    const ans = await this.queryBus.execute<GetThumbnailQuery, Result<FileModel>>(
      new GetThumbnailQuery(new GetThumbnailDto(id), userId)
    );
    
    if (ans.isFailure) {
      return res.send(ans);
    }

    const file = ans.unwrap();    
    res.setHeader('Content-Type', file.contentType);
    return res.send(file.file);    
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   throw new NotImplementedException()
  // }

  @Delete(':fileName')
  async remove(
    @Param('fileName') fileName: string,
    @GetTokenUser('sub') userId: string 
  ) {
    const ans = await this.commandBus.execute<DeleteFileCommand, Result<void>>(
      new DeleteFileCommand(fileName,userId)
    );
    return ans; 
  }
}
