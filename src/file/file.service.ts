import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import sharp from 'sharp';

import { File } from './entities/file.entity';
import { Thumbnail } from './entities/thumbnail.entity';
import { PaginationFileDto } from './dto/pagination-file.dto';
import { IMessage } from 'src/interfaces/message';
import { TypeThumbnail } from '../enum/type-thumbnail.enum';

const primitiveFirebaseUrl = 'https://storage.googleapis.com';


@Injectable()
export class FileService {

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Thumbnail)
    private readonly thumbnailRepository: Repository<Thumbnail>,
  ) {}

  // CREATE
  public async create(
    files: Express.Multer.File[],
    username: string, // mock username
  ): Promise<IMessage> {
    try {
      const bucket = admin.storage().bucket();

      const fileNameArray = [];
      for (const file of files) {
        const { path, size } = file;
        const fileName = path.split('uploads/')[1]; // this is equivalent to uuid.extension
        const fileExtension = path.split('.')[1];
        const firebaseFile = bucket.file(fileName);

        await firebaseFile.save(fs.readFileSync(path), {
          metadata: {
            contentType: this.getContentType(fileExtension),
          },
          public: true,
          gzip: false, // Optional: compress the file or not
        })
        
        const publicUrl = `${primitiveFirebaseUrl}/${bucket.name}/${fileName}`;
        const newFileEntity = this.fileRepository.create({
          url: publicUrl,
          size,
          uploadedBy: username,
        });

        const fileEntitySaved = await this.fileRepository.save(newFileEntity);

        // Now create the thumbnails
        await this.generateAndSaveThumbnails(
          file, bucket, fileName, fileEntitySaved
        );

        fileNameArray.push(fileName);
      }

      this.removeUploadedToFs(fileNameArray);

      return {
        msg: 'Files images were uploaded successfully',
      };
      
    } catch (error) {
      // Make sure to keep FS clean of images
      files.forEach( file => {
        this.removeImageFromFS(file.path.split('uploads/')[1]);
      });

      this.handleExceptionsErrorOnDB(error);
    }
  }

  public async findAll(
    paginationFileDto: PaginationFileDto,
  ): Promise<any> {
    const { limit, offset } = paginationFileDto;

    try {
      
      const [ files, total ] = await this.fileRepository.findAndCount({
        take: limit,
        skip: offset,
      });

      return {
        count: total,
        files: this.transformDataFiles(files),
      }
    } catch (error) {
      this.handleExceptionsErrorOnDB( error );
    }
  }

  public async findOne(id: string): Promise<any> { 
    try {
      const file = await this.fileRepository.findOneBy({id});
      if (!file) {
        throw new BadRequestException(`File with ID: ${id} not found`);
      }

      return this.transformDataFiles([file]);
    } catch (error) {
      this.handleExceptionsErrorOnDB(error);
    }
  }

  // transform data how you need it
  private transformDataFiles(files: File[]) {
    return files.map(file => ({
      ...file,
      thumbnails: file.thumbnails.map(thumbnail => thumbnail.url),
    }));
  }

  private async generateAndSaveThumbnails(
    file: Express.Multer.File,
    bucket: any,
    originalFileName: string,
    fileEntity: File,
  ): Promise<void> {
    // Define the thumbnail size and type
    const thumbnailSizes = [
      { size: 60, type: TypeThumbnail.SMALL },
      { size: 120, type: TypeThumbnail.MEDIUM }
    ];

    try {
      for (const { size, type } of thumbnailSizes) {
        // Generate thumbnail
        const thumbnailBuffer = await sharp(file.path)
          .resize(size, size)
          .toBuffer();
  
        const thumbnailFileName = `${size}x${size}_${originalFileName}`;
        const firebaseThumbnailFile = bucket.file(thumbnailFileName);
  
        // Upload thumbnail to Firebase
        await firebaseThumbnailFile.save(thumbnailBuffer, {
          metadata: {
            contentType: this.getContentType(file.path.split('.')[1]),
          },
          public: true,
        });
  
        const thumbnailUrl = `${primitiveFirebaseUrl}/${bucket.name}/${thumbnailFileName}`;
  
        // Create and save Thumbnail entity
        const newThumbnail = this.thumbnailRepository.create({
          url: thumbnailUrl,
          type,
          file: fileEntity,
        });

        await this.thumbnailRepository.save(newThumbnail);
      }
    } catch (error) {
      this.handleExceptionsErrorOnDB(error);
    }
  }

  private getContentType(extension: string): string {
    switch (extension) {
      case 'jpg':
        return 'image/jpeg';
      case 'jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/png';
    }
  }

  private removeUploadedToFs(fileNameArray: string[]): void {
    fileNameArray.forEach(
      fileName => this.removeImageFromFS(fileName)
    );
  }

  private getStaticFile( fileName: string ): string {
    const path = join( process.cwd(), 'uploads', fileName );
    
    if ( !fs.existsSync(path) ) {
      throw new BadGatewayException( `No file in File-System found with name ${fileName}` );
    }
    
    return path; // whole path from fs
  }

  private deleteFileFromFs( path: string ): void {
      fs.unlinkSync(path);
  }

  private removeImageFromFS( fileName: string ) {
    const pathFromFs = this.getStaticFile(fileName);
    this.deleteFileFromFs(pathFromFs);
  }

  private handleExceptionsErrorOnDB( err: any ) {
    if (err.response?.statusCode === 400) {
      throw new BadRequestException(err.response.message);
    }

    const { errno, sqlMessage } = err;    
    if ( errno === 1062 || errno === 1364 ) throw new BadRequestException(sqlMessage);

    console.log('Customize-Error-File-service: ', err);
    throw new InternalServerErrorException('Error not implemented - file-service: check --logs-- in console');  
    
  }

}
