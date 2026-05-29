import crypto from "node:crypto";
import type { FastifyRequest } from "fastify";

import type { RequestContext } from "../modules/auth/auth.types";

export function getRequestContext(request: FastifyRequest): RequestContext {
  const requestId = getHeaderValue(request.headers["x-request-id"]) ?? crypto.randomUUID();
  const context: RequestContext = {
    requestId,
    correlationId: requestId,
    ipAddress: request.ip,
  };
  const userAgent = getHeaderValue(request.headers["user-agent"]);

  if (userAgent) {
    context.userAgent = userAgent;
  }

  return context;
}

function getHeaderValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
