import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  UpdateResult,
  DeleteResult,
  SelectQueryBuilder,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  ObjectId,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async save(entity: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      console.error('Error al guardar la entidad:', error);
      throw error;
    }
  }

  async findOne(
    optionsOrQueryBuilder?: FindOneOptions<T> | SelectQueryBuilder<T>,
  ): Promise<T | null> {
    try {
      if (optionsOrQueryBuilder instanceof SelectQueryBuilder) {
        return await optionsOrQueryBuilder.getOne();
      } else {
        return await this.repository.findOne(optionsOrQueryBuilder);
      }
    } catch (error) {
      console.error('Error al encontrar la entidad:', error);
      throw error;
    }
  }

  async findAll(
    optionsOrQueryBuilder?: FindManyOptions<T> | SelectQueryBuilder<T>,
  ): Promise<T[]> {
    try {
      if (optionsOrQueryBuilder instanceof SelectQueryBuilder) {
        return await optionsOrQueryBuilder.getMany();
      } else {
        return await this.repository.find(optionsOrQueryBuilder);
      }
    } catch (error) {
      console.error('Error al encontrar las entidades:', error);
      throw error;
    }
  }

  async update(
    criteria:
      | string
      | number
      | FindOptionsWhere<T>
      | Date
      | ObjectId
      | string[]
      | number[]
      | Date[]
      | ObjectId[],
    entity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    try {
      return await this.repository.update(criteria, entity);
    } catch (error) {
      console.error('Error updating the entity:', error);
      throw error;
    }
  }

  async increment(
    where: FindOptionsWhere<T>,
    field: string,
    incremental: number = 1,
  ): Promise<UpdateResult> {
    try {
      return await this.repository.increment(where, field, incremental);
    } catch (error) {
      console.error('Error incrementing the field:', error);
      throw error;
    }
  }

  async delete(criteria: FindOptionsWhere<T>): Promise<DeleteResult> {
    try {
      return await this.repository.delete(criteria);
    } catch (error) {
      console.error('Error al eliminar la entidad:', error);
      throw error;
    }
  }
}
