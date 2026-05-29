import { setNx } from "./redis.js"

export async function claimIncomingMessage(waMessageId: string): Promise<boolean> {
  return setNx(`wa:incoming:${waMessageId}`, "1", 24 * 60 * 60)
}
