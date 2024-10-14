/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

@Module({
    providers: [
        {
            provide: RedisService,
            useFactory: () => {
                const client = new Redis();
                return new RedisService(client);
            },
        },
    ],
    exports: [RedisService],
})
export class RedisModule { }
