import type { FastifyInstance } from "fastify";

import { authenticate } from "../../middlewares/auth.middleware";

export async function authRoutes(app: FastifyInstance) {
  const { authController } = app.container;

  app.post("/register", authController.register);
  app.post("/login", authController.login);
  app.post("/refresh", authController.refresh);
  app.get("/me", { preHandler: authenticate }, authController.me);
  app.post("/logout", authController.logout);
  app.post("/logout-all", { preHandler: authenticate }, authController.logoutAll);
}
