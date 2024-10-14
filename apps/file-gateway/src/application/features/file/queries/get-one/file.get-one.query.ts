import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOneFileDto } from "./file.get-one.dto";
import { FileModel } from "apps/file-gateway/src/domain/models/file.model";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/file-gateway/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { IFileStorageService } from "apps/file-gateway/src/application/services/ifile-storage.service";

export class GetOneFileQuery
{
    constructor(
        public dto: GetOneFileDto, 
        public userId: string
    ) {}
}

@QueryHandler(GetOneFileQuery)
export class GetOneFileQueryHandler implements IQueryHandler<GetOneFileQuery, Result<FileModel>>
{
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService, 
        @Inject("IFileStorageService")
        private readonly fileStorageService : IFileStorageService
    ) {}
    async execute(query: GetOneFileQuery): Promise<Result<FileModel>> {
        const {userId, dto } = query;
        this.logger.info(`User with id ${userId} is trying to retrieve file ${dto.fileName}`)
        
        const ans = await this.fileStorageService.getFileAsync(dto.fileName,false);  
        if(ans.isFailure)
        {
            this.logger.error(`Error retrieving file.`)
            return Result.Fail(ans.unwrapError())
        }
        return Result.Ok(ans.unwrap())
    }   
}