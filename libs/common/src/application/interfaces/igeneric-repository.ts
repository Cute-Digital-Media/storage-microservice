import { FindManyOptions, FindOneOptions } from "typeorm";

export interface IGenericRepository<TEntity, TEntityPersistence> {
    saveNew(file: TEntity): Promise<TEntityPersistence> 

    update(id:string, entity: Partial<TEntity>): Promise<any> 

    delete(id: string): Promise<any> 

    findOneByFilter(options?: FindOneOptions<TEntityPersistence>): Promise<TEntity | undefined> 

    findAll(options?: FindManyOptions<TEntityPersistence>): Promise<TEntity[]> 

    findById(id: string): Promise<TEntity | undefined> 
    
}