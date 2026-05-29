import type { FastifyInstance } from "fastify";

import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { authRoutes } from "./auth.route";
import { AuthService } from "./auth.service";

export async function authPlugin(app: FastifyInstance) {
  const repository = new AuthRepository(app.prisma);
  const service = new AuthService({
    authRepository: repository,
    eventBus: app.eventBus,
    rateLimiter: app.rateLimiter,
    redis: app.redis,
  });
  const controller = new AuthController(service);

  app.decorate("auth", {
    repository,
    service,
    controller,
  });

  await app.register(authRoutes);
}
