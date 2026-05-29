import { createClient as createRedis } from "redis";

import { env } from "../config/env";

export type RedisClient = {
  connect(): Promise<unknown>;
  quit(): Promise<unknown>;
  ping(): Promise<string>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<unknown>;
  del(keys: string[]): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<number | boolean>;
  on(event: "error", listener: (error: Error) => void): RedisClient;
  isOpen: boolean;
};

export function createRedisClient() {
  return createRedis({
    url: env.REDIS_URL,
    socket: {
      reconnectStrategy: false,
    },
  }) as RedisClient;
}

export class RedisStore {
  constructor(private readonly client: RedisClient) {}

  async get(key: string): Promise<string | null> {
    return this.safe(() => this.client.get(key), null);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    await this.safe(async () => {
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, value, { EX: ttlSeconds });
        return;
      }

      await this.client.set(key, value);
    });
  }

  async setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    return this.safe(async () => {
      const result = await this.client.set(key, value, { EX: ttlSeconds, NX: true });
      return result === "OK";
    }, true);
  }

  async ping(): Promise<boolean> {
    return this.safe(async () => (await this.client.ping()) === "PONG", false);
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.safe(() => this.client.del(keys));
  }

  async incr(key: string): Promise<number> {
    return this.safe(() => this.client.incr(key));
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    if (ttlSeconds <= 0) return;
    await this.safe(() => this.client.expire(key, ttlSeconds));
  }

  private async safe<T>(operation: () => Promise<T>, fallback?: T): Promise<T> {
    try {
      return await operation();
    } catch {
      if (fallback !== undefined) {
        return fallback;
      }

      throw new Error("Redis operation failed");
    }
  }
}
