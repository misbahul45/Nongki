import { describe, it, expect } from "vitest"
import { buildApp } from "../app.js"

const app = buildApp()

describe("GET /health", () => {
  it("returns 200 with global response format", async () => {
    const res = await app.request("/health")
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.status).toBe("success")
    expect(body.message).toBe("Health check success")
    expect(body.data.service).toBe("wa-worker")
    expect(body.data.timestamp).toBeDefined()
    expect(body.error).toBeNull()
  })
})
