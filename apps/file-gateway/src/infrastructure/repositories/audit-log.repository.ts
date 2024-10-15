import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";
import { AuditLogEntity } from "../../domain/entities/aduit-log.entity";
import { AuditLogPersistence } from "../persistence/aduit-log.persistence";

@Injectable()
export class AuditLogRepository {

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(AuditLogPersistence)
        private readonly repository: Repository<AuditLogPersistence>
    ) {
    }

    /**
     * Save a new AuditLog entity
     */
    async saveNew(AuditLog: AuditLogEntity): Promise<AuditLogPersistence> {
        const auditLogPersistence = this.mapper.map(AuditLog, AuditLogEntity, AuditLogPersistence);
        return await this.repository.save(auditLogPersistence);
    }

    /**
     * Update a AuditLog entity by filter options
     */
    async update(id:string, entity: Partial<AuditLogEntity>): Promise<any> {
        const auditLogPersistence = await this.repository.findOne({ where: { id } });
        
        if (!auditLogPersistence) {
            return undefined;
        }
        
        const updatedEntity = this.mapper.map(entity, AuditLogEntity, AuditLogPersistence);
        await this.repository.update(id, updatedEntity);
        
        return updatedEntity;
    }

    /**
     * Delete a AuditLog by id
     */
    async delete(id: string): Promise<any> {
        const auditLogPersistence = await this.repository.findOne({ where: { id } });
        
        if (!auditLogPersistence) {
            return undefined;
        }
        
        await this.repository.delete(id);
        return { deleted: true };
    }

    /**
     * Find one AuditLog by filter options
     */
    async findOneByFilter(options?: FindOneOptions<AuditLogPersistence>): Promise<AuditLogEntity | undefined> {
        const auditLogPersistence = await this.repository.findOne(options);
        
        if (!auditLogPersistence) {
            return undefined;
        }
        
        return this.mapper.map(auditLogPersistence, AuditLogPersistence, AuditLogEntity);
    }

    /**
     * Find all AuditLogs based on provided options
     */
    async findAll(options?: FindManyOptions<AuditLogPersistence>): Promise<AuditLogEntity[]> {
        const auditLogs = await this.repository.find(options);
        return auditLogs.map(AuditLog => this.mapper.map(AuditLog, AuditLogPersistence, AuditLogEntity));
    }

    /**
     * Find a AuditLog by id
     */
    async findById(id: string): Promise<AuditLogEntity | undefined> {
        const auditLogPersistence = await this.repository.findOne({ where: { id } });
        
        if (!auditLogPersistence) {
            return undefined;
        }
        
        return this.mapper.map(auditLogPersistence, AuditLogPersistence, AuditLogEntity);
    }
    
    async findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<AuditLogPersistence>): Promise<PaginatedFindResult<AuditLogEntity>> {
        const [results, total] = await this.repository.findAndCount({
            ...options,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        const items = results.map(AuditLog => this.mapper.map(AuditLog, AuditLogPersistence, AuditLogEntity));

        return {
            items,
            limit: pagination.limit,
            currentPage: pagination.page,
            totalPages: Math.ceil(total / pagination.limit), 
        };
    } 
}
