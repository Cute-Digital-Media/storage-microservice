import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateFileDto } from "./file.create.dto.command";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/file-gateway/src/application/services/ilogger.service";
import { FileEntity } from "apps/file-gateway/src/domain/entities/file.entity";
import { IFileRepository } from "apps/file-gateway/src/application/interfaces/reposoitories/ifile-repository";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Result } from "libs/common/application/base";
import { FilePersistence } from "apps/file-gateway/src/infrastructure/persistence/file.persistence";
import { IFileStorageService } from "apps/file-gateway/src/application/services/ifile-storage.service";
import { ValidMimeTypes } from "apps/file-gateway/src/domain/constants/valid-mime-types.constant";
import { AppError } from "libs/common/application/errors/app.errors";
import { EnvVarsAccessor } from "libs/common/configs/env-vars-accessor";
import { StringExtension } from "apps/file-gateway/src/infrastructure/utils/string-extensions";
import * as sharp from 'sharp';

export class CreateFileCommand
{
    constructor(
        public fileName:  string,    
        public size:  number,
        public type:  string,
        public data: Buffer,
        public dto: CreateFileDto, 
        public userId: string
    ) {}
}

@CommandHandler(CreateFileCommand)
export class CreateFileCommandHandler implements ICommandHandler<CreateFileCommand, Result<FileEntity>>
{
    constructor(
        @Inject("IFileRepository")
        private readonly fileRepository: IFileRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @Inject("IFileStorageService")
        private readonly storageFileService: IFileStorageService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: CreateFileCommand): Promise<Result<FileEntity>> {
        const {  size, type, userId, fileName} = command; 
        await this.logger.auditAsync(userId,`Create a new file with extension ${command.type}.`)        
        
        const { isPrivate } = command.dto;

        const generatedFileName = StringExtension.generateFileName(fileName);         
        this.logger.info(`New file name generated: ${generatedFileName}.`)
        
        if(!ValidMimeTypes.includes(type))
        {
            this.logger.error(`Invalid mime type ${type}.`)
            return Result.Fail(new AppError.ValidationError(`Invalid mime type ${type}.`))
        }
        await this.logger.auditAsync(userId,`Uploading file to storage with name: ${generatedFileName}.`)
        const uploadResult = await this.storageFileService.uploadFileAsync(generatedFileName,command.data,isPrivate,type); 
        if(uploadResult.isFailure)
        {
            this.logger.error(`An error ocurred uploading the file.`)        
            return Result.Fail(uploadResult.unwrapError())
        }
        this.logger.info(`Creating thumbnail.`)
        const thumbnailBuffer = await sharp(command.data)
            .resize(200)
            .toBuffer();
        const thumbnailFileName = generatedFileName + "_thumbnail" 
        const thumbnailUploadResult = await this.storageFileService.uploadFileAsync(thumbnailFileName,thumbnailBuffer,isPrivate,type); 
        if(thumbnailUploadResult.isFailure)
        {
            this.logger.error(`An error ocurred uploading the thumb nail file.`)        
            return Result.Fail(thumbnailUploadResult.unwrapError())
        }

        const fileUrl = EnvVarsAccessor.MS_HOST + ":" + EnvVarsAccessor.MS_PORT + "/api/fileGW/file/" + generatedFileName; 
        const file = new FileEntity({
                fileName: generatedFileName,
                originalFileName: fileName, 
                type,
                size,
                url: fileUrl,
                userId,
                isPrivate, 
                thumbnailFileName 
            });
        
        const saveResult = await this.fileRepository.saveNew(file)
        const mapped = this.mapper.map(saveResult,FilePersistence, FileEntity);
        return Result.Ok(mapped); 
    }
}