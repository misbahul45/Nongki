import type { PrismaClient } from "@prisma/client";
import type { ConfirmChannel } from "amqplib";
import type { EventBus } from "../lib/event-bus";
import type { RateLimiter } from "../lib/rate-limit";
import type { RedisClient, RedisStore } from "../lib/redis";
import type { AuthController } from "../modules/auth/auth.controller";
import type { AuthRepository } from "../modules/auth/auth.repository";
import type { AuthService } from "../modules/auth/auth.service";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    redisClient: RedisClient;
    redis: RedisStore;
    eventBus: EventBus;
    rateLimiter: RateLimiter;
    rabbitmq: {
      connection: unknown;
      channel: ConfirmChannel | null;
    };
    container: {
      prisma: PrismaClient;
      redis: RedisStore;
      eventBus: EventBus;
      rateLimiter: RateLimiter;
    };
    auth: {
      repository: AuthRepository;
      service: AuthService;
      controller: AuthController;
    };
  }

  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
      jti: string;
    };
  }
}
