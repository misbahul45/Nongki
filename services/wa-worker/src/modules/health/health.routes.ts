import { Hono } from "hono"
import { successResponse } from "../../core/response.js"
import { rabbitMqReady } from "../../infra/rabbitmq.js"
import { redisPing } from "../../infra/redis.js"

const router = new Hono()

router.get("/", (c) => {
  return c.json(
    successResponse("Health check success", {
      service: "wa-worker",
      timestamp: new Date().toISOString(),
    }),
  )
})

router.get("/ready", async (c) => {
  const checks = {
    redis: (await redisPing()) ? "ok" : "error",
    rabbitmq: rabbitMqReady() ? "ok" : "error",
  }
  const status = Object.values(checks).every((value) => value === "ok") ? "ok" : "degraded"

  return c.json({
    status,
    service: "nongki-wa-worker",
    checks,
  })
})

export { router as healthRoutes }
