import { env } from "../config/env";
import { AppError } from "./errors";
import type { RedisStore } from "./redis";

const rateLimitError = new AppError("Too many requests. Please try again later.", 429, [
  {
    field: "rate_limit",
    message: "Rate limit exceeded",
  },
]);

export class RateLimiter {
  constructor(private readonly redis: RedisStore) {}

  async consume(key: string, limit: number, windowSeconds: number): Promise<void> {
    if (!env.AUTH_RATE_LIMIT_ENABLED) {
      return;
    }

    try {
      const count = await this.redis.incr(key);

      if (count === 1) {
        await this.redis.expire(key, windowSeconds);
      }

      if (count > limit) {
        throw rateLimitError;
      }
    } catch (error) {
      if (error === rateLimitError) {
        throw error;
      }

      if (env.NODE_ENV === "production") {
        throw rateLimitError;
      }
    }
  }
}
