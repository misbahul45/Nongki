import { z } from "zod"

export const sendTextMessageSchema = z.object({
  businessId: z.string().min(1),
  to: z.string().min(8),
  text: z.string().min(1),
})

export const sendTypingSchema = z.object({
  businessId: z.string().min(1),
  to: z.string().min(8),
  state: z.enum(["composing", "paused"]),
})
