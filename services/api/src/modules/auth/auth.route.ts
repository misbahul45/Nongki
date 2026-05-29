import type { FastifyInstance } from "fastify";

import { authenticate } from "../../middlewares/auth.middleware";

export async function authRoutes(app: FastifyInstance) {
  const { controller } = app.auth;

  app.post("/register", controller.register);
  app.post("/login", controller.login);
  app.post("/refresh", controller.refresh);
  app.get("/me", { preHandler: authenticate }, controller.me);
  app.post("/logout", controller.logout);
  app.post("/logout-all", { preHandler: authenticate }, controller.logoutAll);
}
