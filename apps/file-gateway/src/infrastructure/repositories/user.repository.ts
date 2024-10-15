import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserPersistence } from "../persistence/user.persistence";
import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { PaginatedFindResult } from "libs/common/application/base/pagination.result";

@Injectable()
export class UserRepository {

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(UserPersistence)
        private readonly repository: Repository<UserPersistence>
    ) {
    }

    /**
     * Save a new User entity
     */
    async saveNew(user: UserEntity): Promise<UserPersistence> {
        const userPersistence = this.mapper.map(user, UserEntity, UserPersistence);
        return await this.repository.save(userPersistence);
    }

    /**
     * Update a User entity by filter options
     */
    async update(id:string, entity: Partial<UserEntity>): Promise<any> {
        const userPersistence = await this.repository.findOne({ where: { id } });
        
        if (!userPersistence) {
            return undefined;
        }
        
        const updatedEntity = this.mapper.map(entity, UserEntity, UserPersistence);
        await this.repository.update(id, updatedEntity);
        
        return updatedEntity;
    }

    /**
     * Delete a User by id
     */
    async delete(id: string): Promise<any> {
        const UserPersistence = await this.repository.findOne({ where: { id } });
        
        if (!UserPersistence) {
            return undefined;
        }
        
        await this.repository.delete(id);
        return { deleted: true };
    }

    /**
     * Find one User by filter options
     */
    async findOneByFilter(options?: FindOneOptions<UserPersistence>): Promise<UserEntity | undefined> {
        const userPersistence = await this.repository.findOne(options);
        
        if (!userPersistence) {
            return undefined;
        }
        
        return this.mapper.map(userPersistence, UserPersistence, UserEntity);
    }

    /**
     * Find all Users based on provided options
     */
    async findAll(options?: FindManyOptions<UserPersistence>): Promise<UserEntity[]> {
        const Users = await this.repository.find(options);
        return Users.map(User => this.mapper.map(User, UserPersistence, UserEntity));
    }

    /**
     * Find a User by id
     */
    async findById(id: string): Promise<UserEntity | undefined> {
        const userPersistence = await this.repository.findOne({ where: { id } });
        
        if (!userPersistence) {
            return undefined;
        }
        
        return this.mapper.map(userPersistence, UserPersistence, UserEntity);
    }
    
    async findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<UserPersistence>): Promise<PaginatedFindResult<UserEntity>> {
        const [results, total] = await this.repository.findAndCount({
            ...options,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        const items = results.map(User => this.mapper.map(User, UserPersistence, UserEntity));

        return {
            items,
            limit: pagination.limit,
            currentPage: pagination.page,
            totalPages: Math.ceil(total / pagination.limit), 
        };
    } 
}
