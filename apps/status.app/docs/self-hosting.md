# Self-hosting status.app

How to build and run the `apps/status.app` Docker image, and what operators need to know about
environment variables, caching and security. Covers [`Dockerfile`](../Dockerfile), the
`build:docker` / `start:docker` / `preview:docker` scripts in [`package.json`](../package.json),
[`next.config.mjs`](../next.config.mjs),
[`src/config/env.server.mjs`](../src/config/env.server.mjs) and
[`src/app/api/health/route.ts`](../src/app/api/health/route.ts).

## Why a Node runtime

Unlike `apps/hub`, `apps/status.network` and `apps/get.status.app`, which are static exports,
`status.app` needs a running Node server: API routes, ISR, middleware, server actions, the
Postgres-backed admin and Keycloak auth all execute on a server.

The production build uses Next.js `output: 'standalone'` and runs
`node apps/status.app/server.js` in a `node:22-slim` (Debian) container (`ARG NODE_VERSION=22.13.1`
in the Dockerfile).

## Required external services

The image does not include Postgres or Keycloak. Both are pointed at external instances via env
vars:

- **Postgres**: `POSTGRES_URL`, any standard Postgres connection string.
- **Keycloak**: `KEYCLOAK_API_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`,
  `KEYCLOAK_CLIENT_SECRET`.

See [`.env.example`](../.env.example) for the full list.

## Content submodules

`content/specs` is a git submodule (`status-im/status-specs`). The image build copies the working
tree as-is, so the build host must check it out first:

```bash
git submodule update --init --recursive
```

The build runs `scripts/ensure-specs-content.mjs` before Contentlayer. It initializes the
submodule if possible, and fails the build rather than ship an empty `/specs` hub where every
`/specs/*` detail URL returns 404.

## Build and run locally

From `apps/status.app`:

```bash
cp .env.example .env.local   # fill in values
pnpm preview:docker          # builds the image and runs it on :3001
```

Or split into two steps:

```bash
pnpm build:docker
pnpm start:docker
```

The scripts wrap a Docker build whose context is the monorepo root. Build secrets are passed via
BuildKit `--secret` mounts (`INFURA_API_KEY`, `GREENHOUSE_API_KEY`, `GITHUB_TOKEN`) and the
`NEXT_PUBLIC_*` values plus the Greenhouse board IDs are passed as `--build-arg`s.

`start:docker` passes runtime vars with `-e VAR` from the current shell, sourced from `.env.local`
first. `docker run --env-file` does not strip surrounding quotes from values, while Next.js and
dotenv do, and `vercel env pull` writes values quoted. Sourcing first and using `-e VAR`
pass-through avoids this.

## Build-time vs runtime env

- **Build args** (`docker build --build-arg`): all `NEXT_PUBLIC_*` values and the Greenhouse board
  IDs. `NEXT_PUBLIC_*` are inlined into the client bundle during the build.
- **Build secrets** (`docker build --secret id=...,env=...`): `INFURA_API_KEY`,
  `GREENHOUSE_API_KEY`, `GITHUB_TOKEN`. Passed via BuildKit secret mounts so they are not persisted
  in image layers; still required at build time for SSG and ISR fetches.
- **Runtime env** (`docker run -e VAR`): everything the running server reads from `process.env`,
  including `SITE_URL`, `POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY` and the server-side API
  keys above. Server routes and ISR revalidation fetch GitHub releases and Greenhouse jobs at
  runtime, so they are not baked into the image. Optionally `UMAMI_WEBSITE_ID` / `UMAMI_API_URL`.

`src/config/env.server.mjs` treats the runtime-only vars as optional during `next build` (the
`NEXT_PHASE === 'phase-production-build'` check) and required at runtime, except `SITE_URL`, which
is required only on self-hosted production.

## Health endpoint

`GET /api/health` returns `{ ok: true, ts: <ms> }`. The Dockerfile `HEALTHCHECK` polls it every 30
seconds. It is intentionally cheap: no database query, no external fetch.

## Analytics

Server-side download tracking (`/api/download/*`) previously used `@vercel/analytics/server`. The
self-hosted build sends those events to Umami via
[`src/server/services/umami.ts`](../src/server/services/umami.ts). Set `UMAMI_WEBSITE_ID` (and
optionally `UMAMI_API_URL`) to enable it; downloads work fine without it.

## Image publishing

The image is built and pushed by [`ci/docker.Jenkinsfile`](../../../ci/docker.Jenkinsfile) to
Harbor (`harbor.status.im`) as `status-web/status-app`, tagged with the short commit SHA plus
`deploy-master` or `deploy-develop`. The runtime orchestration (Kubernetes, Nomad, Docker Compose
or similar) is not in this repo and depends on infra-team choices.

For local builds, see `build:docker` / `start:docker` / `preview:docker` in
[`package.json`](../package.json).

## CDN and edge caching

Prerendered pages are served with `Cache-Control: s-maxage=3600, stale-while-revalidate=31532400`.
A CDN in front of the container should honor that for HTML, not just for `/_next/static/*`.

This matters because the container runs in a single region. When the CDN treats HTML as
uncacheable, every reader worldwide pays a full round trip to that region, and mobile LCP crosses
the 2.5s Core Web Vitals threshold outside it. Measured from Globalping probes against a
single-region origin with HTML uncached at the edge:

| Probe        | HTML (uncached) | `/_next/static` (edge HIT) |
| ------------ | --------------- | -------------------------- |
| London       | 111ms           | 19ms                       |
| Los Angeles  | 272ms           | 20ms                       |
| Singapore    | 328ms           | 22ms                       |
| Johannesburg | 714ms           | 20ms                       |
| Sydney       | 1190ms          | (MISS) 962ms               |

Two things make HTML safe to cache here:

- Only `en` ships, with `localeDetection` and `localeCookie` disabled in
  [`src/i18n/routing.ts`](../src/i18n/routing.ts), so responses are not per-user and HTML carries
  no `Set-Cookie`.
- Routes that must stay dynamic already say so, for example `/blog` reads `searchParams` and is
  served `Cache-Control: private, no-cache, no-store`. A rule that respects the origin's
  `Cache-Control` will skip them automatically.

One caveat: the same URL returns HTML or an RSC payload (`text/x-component`) depending on the
request headers, and the origin sets `Vary: rsc, next-router-state-tree, next-router-prefetch,
next-router-segment-prefetch`. A CDN that ignores `Vary` will eventually serve an RSC payload as a
document. Either include those headers in the cache key, or bypass the cache when `rsc` is present.

## Security notes for operators

- **`SITE_URL` is required.** It pins the canonical origin used for OAuth `redirect_uri` and any
  server-side fetch back into the app. Without it the app trusts `X-Forwarded-Host`, and an
  attacker can poison that header to redirect OAuth flows or coerce server-side fetches (SSRF).
  The reverse proxy should additionally strip any inbound `X-Forwarded-*` headers and set them
  itself.
- **Do not bake runtime secrets** (`POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY`) into the
  image. They are set at `docker run` time via `-e VAR` and never appear in `docker history` or
  `docker inspect`.
- **`NEXT_PUBLIC_*` values are inlined** into the JS bundle at build time, by design (they are
  public). Do not put anything private behind a `NEXT_PUBLIC_` name.
- **Build secrets** (Greenhouse, GitHub token, Infura server key) are passed via BuildKit
  `--secret` mounts during `docker build`. They are not written to image layers, but treat the
  build environment as trusted.
- **The image runs as non-root** (uid 1001) with `tini` as PID 1. The container only exposes port 3001.

## Multi-instance deployments

If you run more than one replica behind a load balancer, follow the
[Next.js multi-server guide](https://nextjs.org/docs/app/guides/self-hosting#multi-server-deployments):

- Set a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (a base64-encoded 32-byte key) shared across
  replicas.
- Optionally set `deploymentId` in `next.config.mjs` for version-skew protection during rolling
  deploys.
- For a shared ISR cache across replicas, plug in a
  [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath)
  (Redis, S3 or similar). Not configured yet.
