import { Hono } from "hono"
import { internalAuth } from "../../middlewares/internal-auth.middleware.js"
import { successResponse } from "../../core/response.js"
import * as sessionsService from "./sessions.service.js"

const router = new Hono()

router.use("*", internalAuth)

router.post("/:businessId/start", async (c) => {
  const businessId = c.req.param("businessId")
  const result = await sessionsService.startSession(businessId)
  return c.json(successResponse("Session started", result))
})

router.get("/:businessId/status", async (c) => {
  const businessId = c.req.param("businessId")
  const result = sessionsService.getSessionStatus(businessId)
  return c.json(successResponse("Session status retrieved", result))
})

router.post("/:businessId/stop", async (c) => {
  const businessId = c.req.param("businessId")
  const result = await sessionsService.stopSession(businessId)
  return c.json(successResponse("Session stopped", result))
})

export { router as sessionsRoutes }
