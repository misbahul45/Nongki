import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env";

export async function cookiePlugin(app: FastifyInstance) {
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });
}
