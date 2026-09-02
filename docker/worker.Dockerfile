# =============================================================================
# BuyTuk Academy - Worker Dockerfile
# =============================================================================

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/worker/package.json ./apps/worker/
RUN pnpm install --frozen-lockfile

# Build
COPY apps/worker/ ./apps/worker/
COPY inference-gateway/proto/ ./inference-gateway/proto/
COPY tsconfig.base.json ./
RUN pnpm --filter @buytuk/worker build

# Production
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/worker/dist ./dist
COPY --from=base /app/apps/worker/package.json ./

CMD ["node", "dist/main.js"]