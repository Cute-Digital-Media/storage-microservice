import { ConnectionOptions, DefaultJobOptions } from 'bullmq';

export const DEFAULT_JOB_CONCURRENCY = 3;

export const DEFAULT_JOB_OPTIONS: DefaultJobOptions = {
  removeOnComplete: {
    age: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  attempts: process.env.NODE_ENV === 'development' ? 0 : 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};

export const DEFAULT_QUEUE_CONNECTION: ConnectionOptions = {
  host: process.env.REDIS_QUEUES_URL,
  port: Number(process.env.REDIS_QUEUES_PORT || 0),
  password: process.env.REDIS_QUEUES_PASSWORD,
  tls: {
    host: process.env.REDIS_QUEUES_URL,
  },
};
