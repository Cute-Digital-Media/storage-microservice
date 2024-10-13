import { FindManyOptions, FindOneOptions } from "typeorm";

export interface IGenericRepository<TEntity, TEntityPersistence> {
    saveNew(entity: TEntity): Promise<TEntityPersistence>;
    findOneByFilter(id: string, options?: FindOneOptions<TEntityPersistence>): Promise<TEntity | undefined>;
    findAll(options?: FindManyOptions<TEntityPersistence>): Promise<TEntity[]>;
    update(id: string, entity: Partial<TEntity>): Promise<any>;
    delete(id: string): Promise<any>;
}