import type { FastifyReply, FastifyRequest } from "fastify";

import { authCookieNames, clearAccessCookie } from "../lib/cookie";
import { unauthorized } from "../lib/errors";
import { verifyAccessToken } from "../lib/token";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies[authCookieNames.access];

  if (!token) {
    throw unauthorized("Unauthorized");
  }

  try {
    const payload = verifyAccessToken(token);

    request.user = {
      userId: payload.sub,
      email: payload.email,
    };
  } catch (error) {
    clearAccessCookie(reply);
    throw error;
  }
}
