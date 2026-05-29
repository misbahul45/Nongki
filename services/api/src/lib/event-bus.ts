import crypto from "node:crypto";
import type { ConfirmChannel } from "amqplib";

import { env } from "../config/env";

export type EventActor = {
  type: "user" | "customer" | "system" | "service";
  id: string | null;
};

export type EventTenant = {
  businessId: string | null;
};

export type PublishOptions = {
  correlationId?: string;
  actor?: EventActor;
  tenant?: EventTenant;
};

export type EventEnvelope<TPayload extends Record<string, unknown>> = {
  eventId: string;
  eventName: string;
  routingKey: string;
  version: 1;
  occurredAt: string;
  producer: string;
  correlationId: string | null;
  actor: EventActor;
  tenant: EventTenant;
  payload: TPayload;
};

export class EventBus {
  constructor(
    private readonly channel: ConfirmChannel | null,
    private readonly exchange = env.EVENT_EXCHANGE,
  ) {}

  async publish<TPayload extends Record<string, unknown>>(
    eventName: string,
    routingKey: string,
    payload: TPayload,
    options: PublishOptions = {},
  ): Promise<void> {
    if (!env.EVENT_BUS_ENABLED || !this.channel) {
      return;
    }

    const envelope: EventEnvelope<TPayload> = {
      eventId: crypto.randomUUID(),
      eventName,
      routingKey,
      version: 1,
      occurredAt: new Date().toISOString(),
      producer: env.EVENT_PRODUCER,
      correlationId: options.correlationId ?? null,
      actor: options.actor ?? { type: "system", id: null },
      tenant: options.tenant ?? { businessId: null },
      payload,
    };

    const body = Buffer.from(JSON.stringify(envelope));

    const publishOptions: Parameters<ConfirmChannel["publish"]>[3] = {
      contentType: "application/json",
      deliveryMode: 2,
      messageId: envelope.eventId,
      timestamp: Math.floor(Date.now() / 1000),
    };

    if (envelope.correlationId) {
      publishOptions.correlationId = envelope.correlationId;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.channel!.publish(
          this.exchange,
          routingKey,
          body,
          publishOptions,
          (error) => {
            if (error) reject(error);
            else resolve();
          },
        );
      });
    } catch (error) {
      console.warn("RabbitMQ event publish failed", {
        eventId: envelope.eventId,
        routingKey,
        correlationId: envelope.correlationId,
        businessId: envelope.tenant.businessId,
        error,
      });
    }
  }
}
