import { z } from "zod"

export const businessIdParam = z.object({
  businessId: z.string().min(1),
})
