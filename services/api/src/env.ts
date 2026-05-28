import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load env from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  // Add other env vars here
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
