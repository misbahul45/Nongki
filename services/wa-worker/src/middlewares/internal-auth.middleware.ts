import type { Context, Next } from "hono"
import { env } from "../config/env.js"
import { errorResponse } from "../core/response.js"

const TOKEN_HEADER = "x-internal-token"

export async function internalAuth(c: Context, next: Next) {
  const token = c.req.header(TOKEN_HEADER)

  if (!token || token !== env.WA_WORKER_INTERNAL_TOKEN) {
    return c.json(
      errorResponse("Invalid internal token", "UNAUTHORIZED"),
      401,
    )
  }

  await next()
}
