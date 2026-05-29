import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { env } from "../../config/env";
import { unauthorized } from "../../lib/errors";
import { eventRoutingKeys } from "../../lib/events";
import { IdempotencyStore } from "../../lib/idempotency";
import { getRequestContext } from "../../lib/request-context";
import { successResponse } from "../../lib/response";

const inboundWaMessageSchema = z.object({
  businessId: z.string(),
  from: z.string(),
  messageType: z.string(),
  text: z.string().optional(),
  raw: z.unknown().optional(),
});

export async function internalRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    const token = request.headers["x-internal-token"];
    if (token !== env.API_INTERNAL_TOKEN) {
      throw unauthorized("Unauthorized");
    }
  });

  app.post("/wa/messages/inbound", async (request: FastifyRequest, reply: FastifyReply) => {
    const input = inboundWaMessageSchema.parse(request.body);
    const raw = input.raw as { key?: { id?: unknown } } | undefined;
    const waMessageId = typeof raw?.key?.id === "string" ? raw.key.id : null;

    if (waMessageId) {
      const idempotency = new IdempotencyStore(app.redis);
      const claimed = await idempotency.claim(`idempotency:wa-message:${waMessageId}`, 24 * 60 * 60);
      if (!claimed) {
        return reply.send(successResponse({ duplicate: true }, "Duplicate WA message ignored"));
      }
    }

    const context = getRequestContext(request);
    await app.eventBus.publish(
      eventRoutingKeys.waMessageReceived,
      eventRoutingKeys.waMessageReceived,
      {
        businessId: input.businessId,
        waMessageId,
        fromPhone: input.from,
        messageType: input.messageType,
      },
      {
        actor: { type: "customer", id: input.from },
        tenant: { businessId: input.businessId },
        ...(context.correlationId ? { correlationId: context.correlationId } : {}),
      },
    );

    return reply.send(successResponse({ accepted: true }, "WA message accepted"));
  });
}
