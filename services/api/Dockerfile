# ─────────────────────────────────────────
# Dev stage (used by docker-compose.dev.yml)
# ─────────────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
EXPOSE 4000
CMD ["pnpm", "dev"]
# package.json harus punya: "dev": "tsx watch src/server.ts"

# ─────────────────────────────────────────
# Stage 1 — Builder
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Copy source files
COPY src/ src/
COPY tsconfig.json ./

# Build
RUN pnpm build

# ─────────────────────────────────────────
# Stage 2 — Runner
# ─────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/server.js"]

# Fastify must have trustProxy: true since traffic comes through nginx.
# Set it in server initialization: const app = Fastify({ trustProxy: true })
#
# All routes must be registered with prefix '/api/v1', e.g.:
#   app.register(routes, { prefix: '/api/v1' })
