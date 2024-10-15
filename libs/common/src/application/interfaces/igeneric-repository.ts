import { PaginationDto } from "libs/common/presentation/dtos/pagination.dto";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { PaginatedFindResult } from "../base/pagination.result";

export interface IGenericRepository<TEntity, TEntityPersistence> {
    saveNew(file: TEntity): Promise<TEntityPersistence> 

    update(id:string, entity: Partial<TEntity>): Promise<any> 

    delete(id: string): Promise<any> 

    findOneByFilter(options?: FindOneOptions<TEntityPersistence>): Promise<TEntity | undefined> 

    findAll(options?: FindManyOptions<TEntityPersistence>): Promise<TEntity[]> 

    findAllPaginated(pagination: PaginationDto, options?: FindManyOptions<TEntityPersistence>): Promise<PaginatedFindResult<TEntity>> 

    findById(id: string): Promise<TEntity | undefined> 
    
}