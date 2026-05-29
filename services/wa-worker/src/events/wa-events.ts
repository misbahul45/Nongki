import { publishEvent } from "../infra/rabbitmq.js"

export const waEvents = {
  sessionStarted: "wa.session.started",
  qrGenerated: "wa.session.qr_generated",
  connected: "wa.session.connected",
  disconnected: "wa.session.disconnected",
  messageReceived: "wa.message.received",
  messageSent: "wa.message.sent",
  messageFailed: "wa.message.failed",
} as const

export function publishWaEvent(
  routingKey: (typeof waEvents)[keyof typeof waEvents],
  businessId: string,
  payload: Record<string, unknown>,
  correlationId?: string,
) {
  return publishEvent(routingKey, routingKey, payload, {
    businessId,
    ...(correlationId ? { correlationId } : {}),
  })
}
