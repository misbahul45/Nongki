import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env";

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });
}
