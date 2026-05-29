import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(Number(process.env.API_PORT || '3000')),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  
  // Auth
  JWT_ACCESS_SECRET: z.string().default(process.env.JWT_SECRET || 'access-secret'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(7),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  API_INTERNAL_TOKEN: z.string().default("dev-api-token"),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://localhost:5672'),
  AUTH_RATE_LIMIT_ENABLED: z.preprocess((val) => val !== 'false', z.boolean()).default(true),
  AUTH_LOGIN_IP_LIMIT: z.coerce.number().default(20),
  AUTH_LOGIN_EMAIL_LIMIT: z.coerce.number().default(5),
  AUTH_REGISTER_IP_LIMIT: z.coerce.number().default(10),
  AUTH_REGISTER_EMAIL_LIMIT: z.coerce.number().default(3),
  AUTH_REFRESH_IP_LIMIT: z.coerce.number().default(60),
  EVENT_BUS_ENABLED: z.preprocess((val) => val !== 'false', z.boolean()).default(true),
  EVENT_EXCHANGE: z.string().default('nongki.events'),
  EVENT_EXCHANGE_TYPE: z.string().default('topic'),
  EVENT_PRODUCER_API: z.string().default('services/api'),
  EVENT_PRODUCER: z.string().default(process.env.EVENT_PRODUCER_API || 'services/api'),
  AUTH_ME_CACHE_TTL_SECONDS: z.coerce.number().default(60),
  REFRESH_FAMILY_COMPROMISED_TTL_DAYS: z.coerce.number().default(7),
  AUTH_EXPOSE_RAW_IP_IN_EVENTS: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  
  // Cookie
  COOKIE_SECRET: z.string().default('cookie-secret'),
  COOKIE_SECURE: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_DOMAIN: z.string().optional(),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
