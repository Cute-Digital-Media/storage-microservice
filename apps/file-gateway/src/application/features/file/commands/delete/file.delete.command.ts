import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/file-gateway/src/application/services/ilogger.service";
import { IFileRepository } from "apps/file-gateway/src/application/interfaces/reposoitories/ifile-repository";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Result } from "libs/common/application/base";
import { IFileStorageService } from "apps/file-gateway/src/application/services/ifile-storage.service";
import { AppError } from "libs/common/application/errors/app.errors";

export class DeleteFileCommand
{
    constructor(
        public fileName: string, 
        public userId: string
    ) {}
}

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler implements ICommandHandler<DeleteFileCommand, Result<void>>
{
    constructor(
        @Inject("IFileRepository")
        private readonly fileRepository: IFileRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @Inject("IFileStorageService")
        private readonly fileStorageService: IFileStorageService
    ) {}
    async execute(command: DeleteFileCommand): Promise<Result<void>> {
        const { fileName, userId } = command; 
        this.logger.info(`User with id ${userId} is trying to delete file with name ${command.fileName}.`)        
        
        const file = await this.fileRepository.findOneByFilter({
            where: {
                fileName
            }
        })
        if(!file)
        {
            this.logger.error(`File with name ${fileName} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`File not found.`))
        }
        const isPrivate = file.props.isPrivate; 
        
        const ans = await this.fileStorageService.deleteFileAsync(fileName,isPrivate);  
        if(ans.isFailure)
        {
            this.logger.error(`Error deleting the file.`)
            return ans; 
        }
        return Result.Ok(ans.unwrap())
   }
}