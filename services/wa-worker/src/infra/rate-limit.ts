import { env } from "../config/env.js"
import { logger } from "../core/logger.js"
import { redisClient } from "./redis.js"

export async function consumeWaSend(businessId: string): Promise<boolean> {
  const key = `rate:wa-send:${businessId}`
  try {
    const count = await redisClient.incr(key)
    if (count === 1) await redisClient.expire(key, 60)
    return count <= env.WA_SEND_RATE_LIMIT
  } catch (err) {
    logger.warn({ err, businessId }, "WA send rate limit degraded")
    return true
  }
}
