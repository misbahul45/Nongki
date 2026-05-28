import { sessionManager } from "../../whatsapp/session.manager.js"
import type { SessionState } from "../../whatsapp/whatsapp.types.js"

export async function startSession(businessId: string): Promise<SessionState> {
  return sessionManager.startSession(businessId)
}

export function getSessionStatus(businessId: string): SessionState {
  return sessionManager.getSessionStatus(businessId)
}

export async function stopSession(businessId: string): Promise<SessionState> {
  return sessionManager.stopSession(businessId)
}
