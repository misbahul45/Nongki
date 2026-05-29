import crypto from "node:crypto"
import * as amqp from "amqplib"
import type { ConfirmChannel } from "amqplib"
import { env } from "../config/env.js"
import { logger } from "../core/logger.js"

let connection: amqp.ChannelModel | null = null
let channel: ConfirmChannel | null = null

export async function connectRabbitMq() {
  if (env.NODE_ENV === "test" || channel) return
  try {
    connection = await amqp.connect(env.RABBITMQ_URL)
    channel = await connection.createConfirmChannel()
    await channel.assertExchange(env.EVENT_EXCHANGE, env.EVENT_EXCHANGE_TYPE as "topic", { durable: true })
    await channel.assertQueue("nongki.wa.commands", { durable: true })
    await channel.bindQueue("nongki.wa.commands", env.EVENT_EXCHANGE, "wa.command.*")
  } catch (err) {
    logger.warn({ err }, "RabbitMQ connection failed; WA event publishing disabled")
    connection = null
    channel = null
  }
}

export function rabbitMqReady() {
  return Boolean(channel)
}

export async function publishEvent(
  eventName: string,
  routingKey: string,
  payload: Record<string, unknown>,
  options: { correlationId?: string; businessId?: string | null; actorId?: string | null } = {},
) {
  if (!channel) return
  const envelope = {
    eventId: crypto.randomUUID(),
    eventName,
    routingKey,
    version: 1,
    producer: env.EVENT_PRODUCER_WA,
    occurredAt: new Date().toISOString(),
    correlationId: options.correlationId ?? null,
    tenant: { businessId: options.businessId ?? null },
    actor: { type: "service", id: options.actorId ?? null },
    payload,
  }
  try {
    const publishOptions: Parameters<ConfirmChannel["publish"]>[3] = {
      contentType: "application/json",
      deliveryMode: 2,
      messageId: envelope.eventId,
      timestamp: Math.floor(Date.now() / 1000),
    }
    if (envelope.correlationId) {
      publishOptions.correlationId = envelope.correlationId
    }

    await new Promise<void>((resolve, reject) => {
      channel!.publish(
        env.EVENT_EXCHANGE,
        routingKey,
        Buffer.from(JSON.stringify(envelope)),
        publishOptions,
        (err) => err ? reject(err) : resolve(),
      )
    })
  } catch (err) {
    logger.warn({ err, eventId: envelope.eventId, routingKey, businessId: options.businessId }, "RabbitMQ publish failed")
  }
}

export async function closeRabbitMq() {
  await channel?.close().catch((err) => logger.warn({ err }, "RabbitMQ channel close failed"))
  await connection?.close().catch((err) => logger.warn({ err }, "RabbitMQ connection close failed"))
}
