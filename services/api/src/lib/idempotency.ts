import type { RedisStore } from "./redis";

export class IdempotencyStore {
  constructor(private readonly redis: RedisStore) {}

  async claim(key: string, ttlSeconds: number): Promise<boolean> {
    return this.redis.setNx(key, "1", ttlSeconds);
  }
}
