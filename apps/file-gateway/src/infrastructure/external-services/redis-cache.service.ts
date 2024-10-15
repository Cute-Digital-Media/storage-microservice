import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Result } from 'libs/common/application/base';
import { AppError } from 'libs/common/application/errors/app.errors';
import { ILoggerService } from '../../application/services/ilogger.service';
import { ICacheService } from '../../application/services/icache.service';

@Injectable()
export class RedisCacheService implements ICacheService
{
  constructor(
    @InjectRedis()
    private readonly redis: Redis, 
    @Inject("ILoggerService")
    private readonly logger: ILoggerService
  ) {}

  async readCachedValue(key: string): Promise<Result<Buffer>> {
    try {
      const value = await this.redis.getBuffer(key);

      if (value) {
        this.logger.info(`Cache hit for key: ${key}`)
        return Result.Ok(value);
      } else {
        this.logger.warn(`Cache miss for key: ${key}`)
        return Result.Fail(new AppError.NotFoundError('Cache miss'));
      }
    } catch (error) {
      this.logger.error(`Error reading from cache: ${key}`)
      return Result.Fail(new AppError.UnexpectedError(error,"Error reading from cache."));
    }
  }

  async writeCachedValue(key: string, obj: Buffer, exp: number): Promise<Result<any>> {
    try {
      await this.redis.set(key, obj, 'EX', exp);
      return Result.Ok();
    } catch (error) {
      this.logger.error(`Error writing to cache.`)
      return Result.Fail(new AppError.UnexpectedError(error,"Error writing to cache."));
    }
  }
  

  async invalidateCachedValue(key: string): Promise<Result<any>> {
    try {
      await this.redis.del(key); 
      return Result.Ok();
    } catch (error) {
      this.logger.error(`Error deleting from cache.`)
      return Result.Fail(new AppError.UnexpectedError(error,"Error deleting from cache."));
    }
  }
}
