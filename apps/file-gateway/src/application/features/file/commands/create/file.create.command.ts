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
import { v4 } from 'uuid';
import { StringExtension } from "apps/file-gateway/src/infrastructure/utils/string-extensions";

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
        const {  size, type, userId} = command; 
        this.logger.info(`User with id ${userId} is creating a new file with extension ${command.type}.`)        
        
        let { fileName } = command; 
        fileName = StringExtension.generateFileName(fileName);         
        const fileNameWithUser = command.dto.isPrivate ? `${userId}/${fileName}` : fileName;

        this.logger.info(`New file name generated: ${fileName}.`)
        
        if(!ValidMimeTypes.includes(type))
        {
            this.logger.error(`Invalid mime type ${type}.`)
            return Result.Fail(new AppError.ValidationError(`Invalid mime type ${type}.`))
        }
        const uploadResult = await this.storageFileService.uploadFileAsync(fileNameWithUser,command.data,command.dto.isPrivate,type); 
        if(uploadResult.isFailure)
        {
            this.logger.error(`An error ocurred uploading the file.`)        
            return Result.Fail(uploadResult.unwrapError())
        }

        const fileUrl = EnvVarsAccessor.MS_HOST + ":" + EnvVarsAccessor.MS_PORT + "/api/fileGW/file/" + fileName + "?isPrivate=" + command.dto.isPrivate; 
        const file = new FileEntity({fileName,type, size, url: fileUrl});
        
        const saveResult = await this.fileRepository.saveNew(file)
        const mapped = this.mapper.map(saveResult,FilePersistence, FileEntity);
        return Result.Ok(mapped); 
    }
}