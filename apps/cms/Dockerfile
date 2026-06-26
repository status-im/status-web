# =============================================================================
# Production image for apps/cms (Payload CMS 3.83 + Next.js 15)
#
# Build context MUST be the monorepo root so pnpm can resolve workspace
# packages (@status-im/content). From the repo root:
#
#   docker build -f apps/cms/Dockerfile \
#     --build-arg NEXT_PUBLIC_SERVER_URL=https://cms.example.com \
#     --build-arg NEXT_PUBLIC_WEB_URL=https://get.status.app \
#     -t status-cms .
#
# NEXT_PUBLIC_* values are inlined into the client bundle at build time.
# =============================================================================

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# -----------------------------------------------------------------------------
# deps — install cms and its workspace dependencies with a frozen lockfile.
# -----------------------------------------------------------------------------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/cms/package.json apps/cms/package.json
COPY packages/content/package.json packages/content/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter cms...

# -----------------------------------------------------------------------------
# builder — copy sources and build the Next.js production output.
# -----------------------------------------------------------------------------
FROM base AS builder
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_WEB_URL
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    NEXT_PUBLIC_WEB_URL=${NEXT_PUBLIC_WEB_URL} \
    DATABASE_URL=postgresql://build:build@localhost:5432/build \
    PAYLOAD_SECRET=build-time-placeholder-secret

COPY --from=deps /app/ ./
COPY . .
RUN pnpm --filter cms build

# -----------------------------------------------------------------------------
# runner — production runtime.
# -----------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --create-home --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

RUN mkdir -p /app/apps/get.status.app/public/cms/uploads \
    && chown -R nextjs:nodejs /app/apps/get.status.app/public/cms/uploads \
    && chmod +x /app/apps/cms/docker-entrypoint.sh

USER nextjs
WORKDIR /app/apps/cms
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/app/apps/cms/docker-entrypoint.sh"]
CMD ["node_modules/.bin/next", "start"]
