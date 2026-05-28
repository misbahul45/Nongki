import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../src/app.js";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /health", () => {
  it("should return 200 and ok status", async () => {
    const res = await request(app.server)
      .get("/health")
      .expect(200);

    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("nongki-api");
  });
});