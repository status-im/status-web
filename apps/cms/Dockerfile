# =============================================================================
# Production image for apps/cms (Payload CMS 3.83 + Next.js 16)
#
# Build context MUST be the monorepo root so pnpm can resolve workspace
# packages (@status-im/content). From the repo root:
#
#   docker build -f apps/cms/Dockerfile \
#     --build-arg NEXT_PUBLIC_SERVER_URL=https://cms.example.com \
#     --build-arg NEXT_PUBLIC_WEB_URL=https://www.example.com \
#     -t logos-cms .
#
# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so
# they must be the real public origins here — not at runtime.
# =============================================================================

FROM node:24-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# -----------------------------------------------------------------------------
# deps — install only what cms (and its workspace deps) need, with a frozen
# lockfile for reproducible builds.
# -----------------------------------------------------------------------------
FROM base AS deps
# Copy the workspace manifest layer first for better layer caching.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/cms/package.json apps/cms/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/content/package.json packages/content/package.json
COPY packages/tokens/package.json packages/tokens/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter cms...

# -----------------------------------------------------------------------------
# builder — copy sources and build the Next.js production output.
# -----------------------------------------------------------------------------
FROM base AS builder
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_WEB_URL
# Build-time placeholders: payload.config.ts validates these env vars at module
# load (during `next build`). DATABASE_URL/PAYLOAD_SECRET are NOT inlined and
# are overridden with real values at runtime; the build never connects to the DB.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    NEXT_PUBLIC_WEB_URL=${NEXT_PUBLIC_WEB_URL} \
    DATABASE_URL=postgresql://build:build@localhost:5432/build \
    PAYLOAD_SECRET=build-time-placeholder-secret

# Bring in the resolved node_modules from the deps stage, then layer the full
# monorepo sources on top.
COPY --from=deps /app/ ./
COPY . .
RUN pnpm --filter cms build

# -----------------------------------------------------------------------------
# runner — production runtime. Runs `next start` via pnpm.
# -----------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as an unprivileged user (with a home dir so any tool that needs a cache
# has a writable location).
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --create-home --uid 1001 --gid nodejs nextjs

# Copy the fully built monorepo (sources + node_modules + .next output).
COPY --from=builder --chown=nextjs:nodejs /app ./

# Media uploads are written here at runtime; mount a volume on this path so
# uploaded files survive container restarts (see docker-compose).
RUN mkdir -p /app/apps/web/public/cms/uploads \
    && chown -R nextjs:nodejs /app/apps/web/public/cms/uploads \
    && chmod +x /app/apps/cms/docker-entrypoint.sh

USER nextjs
WORKDIR /app/apps/cms
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# The entrypoint applies DB migrations, then execs the CMD below. `next start`
# runs via the workspace-local binary to avoid invoking pnpm/corepack at runtime
# (corepack would try to download a package manager into a non-writable cache
# and crash-loop the container).
ENTRYPOINT ["/app/apps/cms/docker-entrypoint.sh"]
CMD ["node_modules/.bin/next", "start"]
