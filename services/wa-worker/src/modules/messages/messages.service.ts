import { sessionManager } from "../../whatsapp/session.manager.js"
import { consumeWaSend } from "../../infra/rate-limit.js"

export async function sendTextMessage(
  businessId: string,
  to: string,
  text: string,
): Promise<{ businessId: string; to: string; messageId: string } | { error: string; code: string }> {
  if (!(await consumeWaSend(businessId))) {
    return { code: "RATE_LIMITED", error: "WhatsApp send rate limit exceeded" }
  }
  const result = await sessionManager.sendTextMessage(businessId, to, text)
  if (!result) {
    return { code: "SESSION_NOT_CONNECTED", error: "WhatsApp session is not connected" }
  }
  return { businessId, to, messageId: result.messageId }
}

export async function sendTyping(
  businessId: string,
  to: string,
  state: "composing" | "paused",
): Promise<void> {
  await sessionManager.sendPresence(businessId, to, state)
}
