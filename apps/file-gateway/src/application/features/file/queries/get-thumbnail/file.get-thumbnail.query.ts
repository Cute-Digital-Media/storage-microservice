import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FileModel } from "apps/file-gateway/src/domain/models/file.model";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/file-gateway/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { IFileStorageService } from "apps/file-gateway/src/application/services/ifile-storage.service";
import { IFileRepository } from "apps/file-gateway/src/application/interfaces/reposoitories/ifile-repository";
import { AppError } from "libs/common/application/errors/app.errors";
import { GetThumbnailDto } from "./file.get-thumbnail.dto";

export class GetThumbnailQuery
{
    constructor(
        public dto: GetThumbnailDto, 
        public userId: string
    ) {}
}

@QueryHandler(GetThumbnailQuery)
export class GetThumbnailQueryHandler implements IQueryHandler<GetThumbnailQuery, Result<FileModel>>
{
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService, 
        @Inject("IFileStorageService")
        private readonly fileStorageService : IFileStorageService,
        @Inject("IFileRepository")
        private readonly fileRepository : IFileRepository
    ) {}
    async execute(query: GetThumbnailQuery): Promise<Result<FileModel>> {
        const {userId, dto } = query;
        this.logger.info(`User with id ${userId} is trying to retrieve file ${dto.fileName}`)
        const { fileName } = query.dto; 
        
        const file = await this.fileRepository.findOneByFilter({
            where: {
                fileName: fileName
            }
        })
        if(!file)
        {
            this.logger.error(`File with name ${fileName} not found.`)  
            return Result.Fail(new AppError.NotFoundError(`File not found.`))
        }
        if(file.props.isPrivate == true && file.props.userId != userId)
        {
            this.logger.error(`User with id: ${userId} is trying to get a file that belongs to user with id: ${file.props.userId}`)
            return Result.Fail(new AppError.ValidationError("This user has not access to this resource."))
        }   
        const ans = await this.fileStorageService.getFileAsync(file.props.thumbnailFileName,file.props.isPrivate);  
        if(ans.isFailure)
        {
            this.logger.error(`Error retrieving file.`)
            return Result.Fail(new AppError.UnexpectedError(ans.unwrapError(),"Error retrieving file.")); 
        }
        const buffer = ans.unwrap(); 
        return Result.Ok(new FileModel(buffer, fileName,file.props.type))
    }   
}