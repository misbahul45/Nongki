import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  WA_WORKER_PORT: z.coerce.number().default(5000),
  API_INTERNAL_URL: z.string().default("http://localhost:4000"),
  WA_WORKER_INTERNAL_TOKEN: z.string().default("dev-wa-worker-token"),
  API_INTERNAL_TOKEN: z.string().default("dev-api-token"),
  WHATSAPP_AUTH_DIR: z.string().default(".sessions"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
