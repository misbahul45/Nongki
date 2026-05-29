import crypto from "node:crypto";
import type { RedisStore } from "./redis";

export class DistributedLock {
  private readonly token = crypto.randomUUID();

  constructor(
    private readonly redis: RedisStore,
    private readonly key: string,
    private readonly ttlSeconds: number,
  ) {}

  async acquire(): Promise<boolean> {
    return this.redis.setNx(this.key, this.token, this.ttlSeconds);
  }

  async release(): Promise<void> {
    const current = await this.redis.get(this.key);
    if (current === this.token) {
      await this.redis.del(this.key);
    }
  }
}
