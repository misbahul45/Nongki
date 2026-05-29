import Fastify from "fastify";

import { registerContainer } from "./container";
import { errorHandler } from "./middlewares/error.middleware";
import { cookiePlugin } from "./plugins/cookie.plugin";
import { corsPlugin } from "./plugins/cors.plugin";
import { registerRoutes } from "./routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  registerContainer(app);
  app.setErrorHandler(errorHandler);

  app.register(corsPlugin);
  app.register(cookiePlugin);

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "nongki-api",
      timestamp: new Date().toISOString(),
    };
  });

  app.register(registerRoutes, { prefix: "/api/v1" });

  return app;
}

export const app = buildApp();
