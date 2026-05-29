import Fastify from "fastify";

import { containerPlugin } from "./container";
import { errorHandler } from "./middlewares/error.middleware";
import { cookiePlugin } from "./plugins/cookie.plugin";
import { corsPlugin } from "./plugins/cors.plugin";
import { rabbitmqPlugin } from "./plugins/rabbitmq.plugin";
import { redisPlugin } from "./plugins/redis.plugin";
import { registerRoutes } from "./routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.setErrorHandler(errorHandler);

  app.register(corsPlugin);
  app.register(cookiePlugin);
  app.register(redisPlugin);
  app.register(rabbitmqPlugin);
  app.register(containerPlugin);

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "nongki-api",
      timestamp: new Date().toISOString(),
    };
  });

  app.get("/health/ready", async () => {
    const checks = {
      db: "error",
      redis: "error",
      rabbitmq: "error",
    };

    try {
      await app.prisma.$queryRaw`SELECT 1`;
      checks.db = "ok";
    } catch {
      checks.db = "error";
    }

    checks.redis = (await app.redis.ping()) ? "ok" : "error";
    checks.rabbitmq = app.rabbitmq.channel ? "ok" : "error";

    const values = Object.values(checks);
    const status = values.every((value) => value === "ok")
      ? "ok"
      : checks.db === "ok"
        ? "degraded"
        : "error";

    return {
      status,
      service: "nongki-api",
      checks,
    };
  });

  app.register(registerRoutes, { prefix: "/api/v1" });

  return app;
}

export const app = buildApp();
