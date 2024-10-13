import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateFileDto } from "./file.create.dto.command";
import { Inject } from "@nestjs/common";
import { ILoggerService } from "apps/file-gateway/src/application/services/ilogger.service";
import { FileEntity } from "apps/file-gateway/src/domain/entities/file.entity";
import { IFileRepository } from "apps/file-gateway/src/application/interfaces/reposoitories/ifile-repository";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { FilePersistence } from "apps/file-gateway/src/infrastructure/persistence/file.persistence";
import { test } from "apps/file-gateway/src/infrastructure/mappers/profiles/file.profile";

export class CreateFileCommand
{
    constructor(
        public dto: CreateFileDto, 
        public userId: string
    ) {}
}

@CommandHandler(CreateFileCommand)
export class CreateFileCommandHandler implements ICommandHandler<CreateFileCommand>
{
    constructor(
        @Inject("IFileRepository")
        private readonly fileRepository: IFileRepository,
        @Inject("ILoggerService") 
        private readonly logger : ILoggerService,
        @InjectMapper() private readonly mapper: Mapper        
    ) {}
    async execute(command: CreateFileCommand): Promise<any> {
        this.logger.info(`User with id ${command.userId} is creating a new file.`)        
        const file = {fileName:command.dto.fileName}; 
        const mapped = await this.mapper.map(file, FileEntity,test);
        const saveResult = await this.fileRepository.saveNew(file)
        return saveResult; 
    }
}
