import * as z from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  PORT: z.preprocess((value) => Number(value), z.number().default(3000)),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  JWT_SECRET: z.string().optional(),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess((value) => Number(value), z.number()),
  DB_NAME: z.string().default('postgres'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string(),
  DB_SYNCHRONIZE: z.preprocess((value) => !!value, z.boolean().default(false)),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.preprocess((value) => Number(value), z.number()),
  REDIS_EXP: z.preprocess((value) => Number(value), z.number()),
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedConfig.error.format(),
  );
  process.exit(1);
}

export const config = parsedConfig.data;
