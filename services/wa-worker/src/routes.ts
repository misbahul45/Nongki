import type { Hono } from "hono"
import { healthRoutes } from "./modules/health/health.routes.js"
import { sessionsRoutes } from "./modules/sessions/sessions.routes.js"
import { messagesRoutes } from "./modules/messages/messages.routes.js"

export function registerRoutes(app: Hono) {
  app.route("/health", healthRoutes)
  app.route("/sessions", sessionsRoutes)
  app.route("/messages", messagesRoutes)
}
