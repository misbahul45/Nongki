import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({
  path: "../../.env",
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan. Pastikan file ../../.env ada dan berisi DATABASE_URL.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});