import * as amqp from "amqplib";
import fp from "fastify-plugin";
import type { ConfirmChannel } from "amqplib";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env";

export const rabbitmqPlugin = fp(async (app: FastifyInstance) => {
  let connection: amqp.ChannelModel | null = null;
  let channel: ConfirmChannel | null = null;

  if (env.EVENT_BUS_ENABLED && env.NODE_ENV !== "test") {
    try {
      connection = await amqp.connect(env.RABBITMQ_URL);
      channel = await connection.createConfirmChannel();
      await channel.assertExchange(env.EVENT_EXCHANGE, env.EVENT_EXCHANGE_TYPE as "topic", { durable: true });
      await channel.assertQueue("nongki.api.wa-events", { durable: true });
      await channel.bindQueue("nongki.api.wa-events", env.EVENT_EXCHANGE, "wa.session.*");
      await channel.bindQueue("nongki.api.wa-events", env.EVENT_EXCHANGE, "wa.message.received");
      await channel.bindQueue("nongki.api.wa-events", env.EVENT_EXCHANGE, "wa.message.failed");
      await channel.assertQueue("nongki.api.ai-events", { durable: true });
      await channel.bindQueue("nongki.api.ai-events", env.EVENT_EXCHANGE, "ai.agent.run_completed");
      await channel.bindQueue("nongki.api.ai-events", env.EVENT_EXCHANGE, "ai.agent.run_failed");
      await channel.bindQueue("nongki.api.ai-events", env.EVENT_EXCHANGE, "ai.knowledge.*");
    } catch (error) {
      app.log.error({ error }, "RabbitMQ connection failed; event publishing disabled");
      channel = null;
      connection = null;
    }
  }

  app.decorate("rabbitmq", {
    connection,
    channel,
  });

  app.addHook("onClose", async () => {
    await channel?.close().catch((error) => app.log.warn({ error }, "RabbitMQ channel close failed"));
    await connection?.close().catch((error) => app.log.warn({ error }, "RabbitMQ connection close failed"));
  });
});
