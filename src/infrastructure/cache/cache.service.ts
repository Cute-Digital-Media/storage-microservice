import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import { LoggerService } from '../loggers/logger.service';
import { config } from '../../config/envs';

@Injectable()
export class CacheService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly logger: LoggerService,
  ) {}

  async readCached<T>(key: string) {
    try {
      const value = await this.redis.get(key);

      if (value) {
        this.logger.log(`Cache hit for key: ${key}`);
        return JSON.parse(value) as T;
      } else {
        this.logger.warn(`Cache miss for key: ${key}`);
      }
      return;
    } catch (error) {
      this.logger.error(`Error reading from cache: ${key}`);
    }
  }

  async writeCached(key: string, obj: any, exp: number = config.REDIS_EXP) {
    try {
      await this.redis.set(key, JSON.stringify(obj), 'EX', exp);
      this.logger.log(
        `Cache set for key: ${key} with expiration of ${exp} seconds`,
      );
    } catch (error) {
      this.logger.error(`Error writing to cache for key: ${key}`);
    }
  }

  async invalidateCached(key: string) {
    try {
      await this.redis.del(key);
      this.logger.log(`Cache invalidated for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting from cache for key: ${key}`);
    }
  }

  async invalidateCachedPattern(pattern: string) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
}
