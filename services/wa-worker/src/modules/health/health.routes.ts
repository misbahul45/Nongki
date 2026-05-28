import { Hono } from "hono"
import { successResponse } from "../../core/response.js"

const router = new Hono()

router.get("/", (c) => {
  return c.json(
    successResponse("Health check success", {
      service: "wa-worker",
      timestamp: new Date().toISOString(),
    }),
  )
})

export { router as healthRoutes }
