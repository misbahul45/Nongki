# ─────────────────────────────────────────
# Dev stage (used by docker-compose.dev.yml)
# ─────────────────────────────────────────
FROM node:22-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
EXPOSE 5000
CMD ["pnpm", "dev"]
# package.json harus punya: "dev": "tsx watch src/index.ts"

# ─────────────────────────────────────────
# Stage 1 — Builder
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

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

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

VOLUME /app/sessions

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

# Baileys uses WebSocket, NOT puppeteer/chromium.
# Sessions volume is critical — losing it requires re-scanning QR code.
