import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File } from './entities/file.entity';
import { Thumbnail } from './entities/thumbnail.entity';


@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [

    TypeOrmModule.forFeature([File, Thumbnail]),

  ],
  exports: [
    TypeOrmModule,
    FileService,
  ]

})
export class FileModule {}
