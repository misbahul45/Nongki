import { createClient } from "redis"
import { env } from "../config/env.js"
import { logger } from "../core/logger.js"

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: { reconnectStrategy: false },
})

redisClient.on("error", (err) => {
  logger.warn({ err }, "Redis client error")
})

export async function connectRedis() {
  if (env.NODE_ENV === "test" || redisClient.isOpen) return
  try {
    await redisClient.connect()
  } catch (err) {
    logger.warn({ err }, "Redis connection failed; WA cache/idempotency degraded")
  }
}

export async function redisPing(): Promise<boolean> {
  try {
    return redisClient.isOpen && (await redisClient.ping()) === "PONG"
  } catch {
    return false
  }
}

export async function setCache(key: string, value: string, ttlSeconds?: number) {
  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await redisClient.set(key, value, { EX: ttlSeconds })
    } else {
      await redisClient.set(key, value)
    }
  } catch (err) {
    logger.warn({ err, key }, "Redis set failed")
  }
}

export async function setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
  try {
    const result = await redisClient.set(key, value, { EX: ttlSeconds, NX: true })
    return result === "OK"
  } catch (err) {
    logger.warn({ err, key }, "Redis set NX failed")
    return true
  }
}
