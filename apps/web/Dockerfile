# ─────────────────────────────────────────
# Dev stage (used by docker-compose.dev.yml)
# ─────────────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
ENV PORT=5173
ENV HOST=0.0.0.0
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

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
COPY static/ static/
COPY svelte.config.js vite.config.ts tsconfig.json components.json ./

# Build
RUN pnpm build

# ─────────────────────────────────────────
# Stage 2 — Runner
# ─────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "build"]

# Requires @sveltejs/adapter-node in svelte.config.js.
# If not set, add: import adapter from '@sveltejs/adapter-node'; and set adapter: adapter() in the kit config.
