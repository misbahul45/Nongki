import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { FastifyInstance } from "fastify";

import { env } from "./env";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthRepository } from "./modules/auth/auth.repository";
import { AuthService } from "./modules/auth/auth.service";

export function registerContainer(app: FastifyInstance) {
  const adapter = new PrismaPg(env.DATABASE_URL);
  const prisma = new PrismaClient({ adapter });
  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);

  app.decorate("container", {
    authRepository,
    authService,
    authController,
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}
