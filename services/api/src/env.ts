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
