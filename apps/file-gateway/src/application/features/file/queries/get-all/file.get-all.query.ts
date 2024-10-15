import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FileModel } from "apps/file-gateway/src/domain/models/file.model";
import { Result } from "libs/common/application/base";
import { ILoggerService } from "apps/file-gateway/src/application/services/ilogger.service";
import { Inject } from "@nestjs/common";
import { AppError } from "libs/common/application/errors/app.errors";
import { FilePersistence } from "apps/file-gateway/src/infrastructure/persistence/file.persistence";
import { FindManyOptions } from "typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { BaseError } from "libs/common/application/errors/base.errors";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { IFileRepository } from "apps/file-gateway/src/application/interfaces/reposoitories/ifile-repository";
import { FileEntity } from "apps/file-gateway/src/domain/entities/file.entity";

export class GetAllFilesQuery {
    constructor(
        public readonly userId: string,
        public readonly isPrivate: boolean,
        public readonly filter: FindManyOptions<FilePersistence>, 
        public readonly pagination: PaginationDto 
    ) {}
}

@QueryHandler(GetAllFilesQuery)
export class GetAllFilesQueryHandler implements IQueryHandler<GetAllFilesQuery, Result<PaginatedFindResult<FileEntity>>> {
    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService,
        @Inject("IFileRepository")
        private readonly fileRepository: IFileRepository
    ) {}

    async execute(query: GetAllFilesQuery): Promise<Result<PaginatedFindResult<FileEntity>>> {
        const { userId, isPrivate, filter, pagination } = query;

        this.logger.info(`User with id ${userId} is trying to retrieve all files`);

        try {
            const files = await this.fileRepository.findAllPaginated(pagination, {
                where: {
                    ...filter.where,
                    userId: userId, 
                    isPrivate: isPrivate
                }
            });

            return Result.Ok(files);
        } catch (error) {
            this.logger.error(`Failed to retrieve files for user ${userId}: ${error.message}`);
            return Result.Fail(new AppError.UnexpectedError(error,"Error retrieving files"));
        }
    }
}
