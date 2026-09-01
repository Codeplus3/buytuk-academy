# =============================================================================
# BuyTuk Academy - API Dockerfile
# =============================================================================

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# Build
COPY apps/api/ ./apps/api/
COPY tsconfig.base.json ./
RUN pnpm --filter @buytuk/api build

# Production
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/package.json ./

EXPOSE 4000
CMD ["node", "dist/main.js"]