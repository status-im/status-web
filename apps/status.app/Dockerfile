# syntax=docker/dockerfile:1.7
#
# Multi-stage Docker build for self-hosting `apps/status.app` (Next.js 15).
#
# Layout: build context is the monorepo root.
# Build:  docker build -f apps/status.app/Dockerfile \
#             --secret id=infura_api_key,env=INFURA_API_KEY \
#             --secret id=greenhouse_api_key,env=GREENHOUSE_API_KEY \
#             --secret id=github_token,env=GITHUB_TOKEN \
#             --build-arg NEXT_PUBLIC_GHOST_API_URL=... \
#             ... \
#             -t status-web/status.app:dev .
# Run:    see package.json `start:docker` (pass runtime secrets via -e, not --env-file)
#
# Uses Next.js standalone output (`output: 'standalone'`) to ship only the
# files actually needed at runtime — server.js, traced node_modules, .next/static.
# see: https://nextjs.org/docs/app/api-reference/config/next-config-js/output

ARG NODE_VERSION=22.13.1
ARG PNPM_VERSION=9.12.3

# ────────────────────────────────────────────────────────────────────────────
# Stage 1 — base: debian-slim + pnpm via corepack
# ────────────────────────────────────────────────────────────────────────────
# why debian-slim over alpine: many native modules in this workspace (keccak,
# unrs-resolver, etc.) ship glibc-only prebuilt binaries; alpine's musl forces
# slow compile-from-source on every build.
FROM node:${NODE_VERSION}-slim AS base
ARG PNPM_VERSION
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates wget tini \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /workspace
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

# ────────────────────────────────────────────────────────────────────────────
# Stage 2 — deps: install workspace deps required to build status.app
# ────────────────────────────────────────────────────────────────────────────
FROM base AS deps

# Native build deps for postinstall scripts (keccak, etc.) AND for workspace
# package `prepare`/`build` hooks (@status-im/icons, @status-im/components).
# These stay in the deps/build stages only; the runtime stage drops them.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ git \
    && rm -rf /var/lib/apt/lists/*

# Workspace metadata first — best cache hit when only app code changes.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc tsconfig.base.json turbo.json ./
COPY patches/ ./patches/
COPY apps/status.app/package.json ./apps/status.app/
COPY packages/ ./packages/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --filter status.app... \
      --frozen-lockfile

# ────────────────────────────────────────────────────────────────────────────
# Stage 3 — build: compile Contentlayer + Next.js standalone bundle
# ────────────────────────────────────────────────────────────────────────────
FROM deps AS build

# App source after install so dependency layers stay cached on code-only changes.
COPY apps/status.app/ ./apps/status.app/

# NEXT_PUBLIC_* are inlined into client bundles; required for SSG/ISR.
ARG NEXT_PUBLIC_GHOST_API_URL
ARG NEXT_PUBLIC_GHOST_API_KEY
ARG NEXT_PUBLIC_INFURA_API_KEY
ARG NEXT_PUBLIC_HASURA_API_URL
ARG GREENHOUSE_STATUS_BOARD_ID
ARG GREENHOUSE_LOGOS_BOARD_ID

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_GHOST_API_URL=$NEXT_PUBLIC_GHOST_API_URL
ENV NEXT_PUBLIC_GHOST_API_KEY=$NEXT_PUBLIC_GHOST_API_KEY
ENV NEXT_PUBLIC_INFURA_API_KEY=$NEXT_PUBLIC_INFURA_API_KEY
ENV NEXT_PUBLIC_HASURA_API_URL=$NEXT_PUBLIC_HASURA_API_URL
ENV GREENHOUSE_STATUS_BOARD_ID=$GREENHOUSE_STATUS_BOARD_ID
ENV GREENHOUSE_LOGOS_BOARD_ID=$GREENHOUSE_LOGOS_BOARD_ID

# Server-side build secrets via BuildKit mounts (not persisted in layer ENV).
# Runtime-only placeholders are scoped to this RUN so env.server.mjs validation
# passes during build; real values are injected at `docker run` time.
RUN --mount=type=secret,id=infura_api_key \
    --mount=type=secret,id=greenhouse_api_key \
    --mount=type=secret,id=github_token \
    export INFURA_API_KEY="$(cat /run/secrets/infura_api_key)" \
    GREENHOUSE_API_KEY="$(cat /run/secrets/greenhouse_api_key)" \
    GITHUB_TOKEN="$(cat /run/secrets/github_token)" \
    POSTGRES_URL="postgres://build:build@build-placeholder/build" \
    KEYCLOAK_API_URL="https://build-placeholder.invalid" \
    KEYCLOAK_REALM="build-placeholder" \
    KEYCLOAK_ISSUER="https://build-placeholder.invalid/realms/build-placeholder" \
    KEYCLOAK_CLIENT_ID="build-placeholder" \
    KEYCLOAK_CLIENT_SECRET="build-placeholder" \
    BAMBOOHR_API_KEY="build-placeholder" \
    SITE_URL="https://build-placeholder.invalid" \
    && pnpm turbo run build --filter=status.app^... \
    && pnpm --filter status.app build

# ────────────────────────────────────────────────────────────────────────────
# Stage 4 — runtime: minimal image with `next start` (standalone)
# ────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates wget tini \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Copy standalone output. Next.js places monorepo apps under apps/<name>/
# inside the standalone bundle. server.js is at apps/status.app/server.js.
COPY --from=build --chown=nextjs:nodejs /workspace/apps/status.app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /workspace/apps/status.app/.next/static ./apps/status.app/.next/static
COPY --from=build --chown=nextjs:nodejs /workspace/apps/status.app/public ./apps/status.app/public

# Writable cache dir for ISR revalidation, fetch cache, and image optimization.
RUN mkdir -p apps/status.app/.next && chown -R nextjs:nodejs apps/status.app/.next

USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --spider --tries=1 http://127.0.0.1:3001/api/health || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "apps/status.app/server.js"]
