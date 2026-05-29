import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env";
import { createRedisClient, RedisStore } from "../lib/redis";

export const redisPlugin = fp(async (app: FastifyInstance) => {
  const client = createRedisClient();

  client.on("error", (error) => {
    app.log.warn({ error }, "Redis client error");
  });

  if (env.NODE_ENV !== "test") {
    try {
      await client.connect();
    } catch (error) {
      app.log.warn({ error }, "Redis connection failed; non-critical Redis features will degrade");
    }
  }

  app.decorate("redisClient", client);
  app.decorate("redis", new RedisStore(client));

  app.addHook("onClose", async () => {
    if (client.isOpen) {
      await client.quit();
    }
  });
});
