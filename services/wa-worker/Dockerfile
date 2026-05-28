# Dev stage
FROM node:22-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
EXPOSE 5000
CMD ["pnpm", "dev"]

# Builder
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY src/ src/
COPY tsconfig.json ./
RUN pnpm build

# Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
VOLUME /app/.sessions
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
