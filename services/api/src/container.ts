import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

import { env } from "./config/env";
import { EventBus } from "./lib/event-bus";
import { RateLimiter } from "./lib/rate-limit";

export const containerPlugin = fp(async (app: FastifyInstance) => {
  const adapter = new PrismaPg(env.DATABASE_URL);
  const prisma = new PrismaClient({ adapter });
  const eventBus = new EventBus(app.rabbitmq.channel);
  const rateLimiter = new RateLimiter(app.redis);

  app.decorate("prisma", prisma);
  app.decorate("eventBus", eventBus);
  app.decorate("rateLimiter", rateLimiter);
  app.decorate("container", {
    prisma,
    redis: app.redis,
    eventBus,
    rateLimiter,
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
