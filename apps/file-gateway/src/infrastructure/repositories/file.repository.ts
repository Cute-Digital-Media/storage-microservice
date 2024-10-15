import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { FilePersistence } from "../persistence/file.persistence";
import { FileEntity } from "../../domain/entities/file.entity";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";

@Injectable()
export class FileRepository {

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(FilePersistence)
        private readonly repository: Repository<FilePersistence>
    ) {
    }

    /**
     * Save a new file entity
     */
    async saveNew(file: FileEntity): Promise<FilePersistence> {
        const filePersistence = this.mapper.map(file, FileEntity, FilePersistence);
        return await this.repository.save(filePersistence);
    }

    /**
     * Update a file entity by filter options
     */
    async update(id:string, entity: Partial<FileEntity>): Promise<any> {
        const filePersistence = await this.repository.findOne({ where: { id } });
        
        if (!filePersistence) {
            return undefined;
        }
        
        const updatedEntity = this.mapper.map(entity, FileEntity, FilePersistence);
        await this.repository.update(id, updatedEntity);
        
        return updatedEntity;
    }

    /**
     * Delete a file by id
     */
    async delete(id: string): Promise<any> {
        const filePersistence = await this.repository.findOne({ where: { id } });
        
        if (!filePersistence) {
            return undefined;
        }
        
        await this.repository.delete(id);
        return { deleted: true };
    }

    /**
     * Find one file by filter options
     */
    async findOneByFilter(options?: FindOneOptions<FilePersistence>): Promise<FileEntity | undefined> {
        const filePersistence = await this.repository.findOne(options);
        
        if (!filePersistence) {
            return undefined;
        }
        
        return this.mapper.map(filePersistence, FilePersistence, FileEntity);
    }

    /**
     * Find all files based on provided options
     */
    async findAll(options?: FindManyOptions<FilePersistence>): Promise<FileEntity[]> {
        const files = await this.repository.find(options);
        return files.map(file => this.mapper.map(file, FilePersistence, FileEntity));
    }

    /**
     * Find a file by id
     */
    async findById(id: string): Promise<FileEntity | undefined> {
        const filePersistence = await this.repository.findOne({ where: { id } });
        
        if (!filePersistence) {
            return undefined;
        }
        
        return this.mapper.map(filePersistence, FilePersistence, FileEntity);
    }

    async findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<FilePersistence>): Promise<PaginatedFindResult<FileEntity>> {
        const [results, total] = await this.repository.findAndCount({
            ...options,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        const items = results.map(file => this.mapper.map(file, FilePersistence, FileEntity));

        return {
            items,
            limit: pagination.limit,
            currentPage: pagination.page,
            totalPages: Math.ceil(total / pagination.limit), 
        };
    } 
}
