import { serve } from "@hono/node-server"
import { buildApp } from "./app.js"
import { env } from "./config/env.js"
import { logger } from "./core/logger.js"
import { closeRabbitMq, connectRabbitMq } from "./infra/rabbitmq.js"
import { connectRedis, redisClient } from "./infra/redis.js"

await connectRedis()
await connectRabbitMq()

const app = buildApp()

const server = serve(
  {
    fetch: app.fetch,
    port: env.WA_WORKER_PORT,
    hostname: "0.0.0.0",
  },
  (info) => {
    logger.info(
      { port: info.port, address: info.address },
      "WA Worker server started",
    )
  },
)

function gracefulShutdown(signal: string) {
  logger.info({ signal }, "Received shutdown signal")
  server.close()
  void closeRabbitMq()
  void redisClient.quit().catch((err) => logger.warn({ err }, "Redis close failed"))
  process.exit(0)
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))
