import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  WA_WORKER_PORT: z.coerce.number().default(5000),
  API_INTERNAL_URL: z.string().default("http://localhost:4000"),
  WA_WORKER_INTERNAL_TOKEN: z.string().default("dev-wa-worker-token"),
  API_INTERNAL_TOKEN: z.string().default("dev-api-token"),
  WHATSAPP_AUTH_DIR: z.string().default(".sessions"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  RABBITMQ_URL: z.string().default("amqp://localhost:5672"),
  EVENT_EXCHANGE: z.string().default("nongki.events"),
  EVENT_EXCHANGE_TYPE: z.string().default("topic"),
  EVENT_PRODUCER_WA: z.string().default("services/wa-worker"),
  WA_SEND_RATE_LIMIT: z.coerce.number().default(60),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
