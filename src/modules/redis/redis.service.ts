/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private client: Redis;
    constructor(private readonly redisClient: Redis) { }

    async set(key: string, value: any, ttl?: number) {
        const jsonValue = JSON.stringify(value);
        await this.redisClient.set(key, jsonValue);
        if (ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null; 
    }

    async del(key: string) {
        await this.redisClient.del(key);
    }
}
