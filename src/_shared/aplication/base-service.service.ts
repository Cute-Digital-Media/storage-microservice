import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  UpdateResult,
  DeleteResult,
  SelectQueryBuilder,
  FindManyOptions,
  FindOneOptions,
  ObjectId,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async save(entity: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      console.error('Error saving entities:', error);
      throw error;
    }
  }

  async findOne(
    optionsOrQueryBuilder?: FindOneOptions<T> | SelectQueryBuilder<T>,
  ): Promise<T> {
    try {
      let entity: T | null;

      if (optionsOrQueryBuilder instanceof SelectQueryBuilder) {
        entity = await optionsOrQueryBuilder.getOne();
      } else {
        entity = await this.repository.findOne(optionsOrQueryBuilder);
      }

      if (!entity) {
        throw new NotFoundException('Entity not found');
      }

      return entity;
    } catch (error) {
      console.error('Error finding entities:', error);
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
      console.error('Error finding entities:', error);
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
    let data: DeleteResult;
    try {
      data = await this.repository.delete(criteria);
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
    if (!data.affected) throw new NotFoundException('Entity not found');
    return data;
  }
}
