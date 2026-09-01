# =============================================================================
# BuyTuk Academy - Web Dockerfile
# =============================================================================

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# Build
COPY apps/web/ ./apps/web/
COPY tsconfig.base.json ./
RUN pnpm --filter @buytuk/web build

# Production
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/apps/web/.next/standalone ./
COPY --from=base /app/apps/web/.next/static ./.next/static
COPY --from=base /app/apps/web/public ./public

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]