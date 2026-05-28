import { Hono } from "hono"
import { registerRoutes } from "./routes.js"
import { logger } from "./core/logger.js"
import { errorResponse } from "./core/response.js"

export function buildApp() {
  const app = new Hono()

  registerRoutes(app)

  app.notFound((c) => {
    return c.json(
      errorResponse(
        `Route ${c.req.method} ${c.req.path} not found`,
        "NOT_FOUND",
      ),
      404,
    )
  })

  app.onError((err, c) => {
    logger.error({ err }, "Unhandled error")
    return c.json(
      errorResponse("Internal server error", "INTERNAL_ERROR"),
      500,
    )
  })

  return app
}
