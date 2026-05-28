import { Hono } from "hono"
import { internalAuth } from "../../middlewares/internal-auth.middleware.js"
import { successResponse, errorResponse } from "../../core/response.js"
import { sendTextMessageSchema, sendTypingSchema } from "./messages.schema.js"
import * as messagesService from "./messages.service.js"

const router = new Hono()

router.use("*", internalAuth)

router.post("/send", async (c) => {
  const body = await c.req.json()
  const parsed = sendTextMessageSchema.safeParse(body)

  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }))
    return c.json(
      errorResponse("Validation failed", "VALIDATION_ERROR", detail),
      400,
    )
  }

  const result = await messagesService.sendTextMessage(
    parsed.data.businessId,
    parsed.data.to,
    parsed.data.text,
  )

  if ("code" in result) {
    return c.json(
      errorResponse(result.error, result.code, { businessId: parsed.data.businessId }),
      409,
    )
  }

  return c.json(successResponse("Message sent successfully", result))
})

router.post("/typing", async (c) => {
  const body = await c.req.json()
  const parsed = sendTypingSchema.safeParse(body)

  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }))
    return c.json(
      errorResponse("Validation failed", "VALIDATION_ERROR", detail),
      400,
    )
  }

  await messagesService.sendTyping(parsed.data.businessId, parsed.data.to, parsed.data.state)

  return c.json(successResponse("Typing indicator sent", null))
})

export { router as messagesRoutes }
