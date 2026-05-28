import { describe, it, expect } from "vitest"
import { buildApp } from "../app.js"

const app = buildApp()

describe("Internal auth middleware", () => {
  it("POST /messages/send without token returns 401", async () => {
    const res = await app.request("/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: "biz_1", to: "6281234567890", text: "halo" }),
    })
    expect(res.status).toBe(401)

    const body = await res.json()
    expect(body.status).toBe("error")
    expect(body.message).toBe("Invalid internal token")
    expect(body.data).toBeNull()
    expect(body.error.code).toBe("UNAUTHORIZED")
  })

  it("GET /sessions/biz_1/status without token returns 401", async () => {
    const res = await app.request("/sessions/biz_1/status")
    expect(res.status).toBe(401)

    const body = await res.json()
    expect(body.status).toBe("error")
    expect(body.message).toBe("Invalid internal token")
    expect(body.data).toBeNull()
    expect(body.error.code).toBe("UNAUTHORIZED")
  })
})
