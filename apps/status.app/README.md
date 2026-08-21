# status.app

Next.js 15 app behind [https://status.app](https://status.app).

## Prerequisites

- **[Node.js](https://nodejs.org/)** v22.x
- **[pnpm](https://pnpm.io)** v9.12.x

## Getting Started

First, follow the [root README](../../README.md#getting-started) to clone the repo, initialize submodules, and install dependencies.

Pull environment variables (Vercel-managed):

```bash
vercel env pull .env.local
```

Or copy the example and fill in the values you need:

```bash
cp .env.example .env.local
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001).

## Database (development)

Explore the environment's database:

```bash
pnpm db:explore
```

Directly modify the database and its schema:

```bash
pnpm db:push
```

On conflict, drop your migrations and generate new ones:

```bash
rm -r ./migrations && git checkout <base> -- ./migrations && pnpm db:generate
```

## Self-hosting (Docker)

Unlike `apps/hub`, `apps/status.network`, and `apps/get.status.app` (all static-exported), `apps/status.app` requires a **Node.js runtime**: API routes, ISR, middleware, server actions, Postgres-backed admin, and Keycloak auth all need a running server.

The production build uses Next.js [`output: 'standalone'`](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) and runs `node apps/status.app/server.js` in a `node:22-slim` (Debian) container.

### Required external services

The container does **not** include Postgres or Keycloak — both are pointed at external instances via env vars:

- **Postgres** — `POSTGRES_URL` (any standard Postgres connection string)
- **Keycloak** — `KEYCLOAK_API_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`

See [`.env.example`](./.env.example) for the full list.

### Content submodules

`content/specs` is a git submodule ([status-im/status-specs](https://github.com/status-im/status-specs)). The image build copies the working tree as-is, so the build host **must** check it out first:

```bash
git submodule update --init --recursive
```

Skipping it used to produce a build that succeeded but shipped an empty `/specs` hub with every `/specs/*` detail URL returning 404. Contentlayer now fails the production build instead, so a missing submodule surfaces as a build error rather than as lost pages.

### Build and run locally

From this directory:

```bash
cp .env.example .env.local   # fill in values
pnpm preview:docker          # builds the image and runs it on :3001
```

Or split into two steps:

```bash
pnpm build:docker
pnpm start:docker
```

Behind the scenes (from repo root):

```bash
docker build -f apps/status.app/Dockerfile \
  --secret id=infura_api_key,env=INFURA_API_KEY \
  --secret id=greenhouse_api_key,env=GREENHOUSE_API_KEY \
  --secret id=github_token,env=GITHUB_TOKEN \
  --build-arg NEXT_PUBLIC_GHOST_API_URL=... \
  --build-arg NEXT_PUBLIC_GHOST_API_KEY=... \
  # ...other --build-arg NEXT_PUBLIC_* / GREENHOUSE_*_BOARD_ID
  -t status-web/status.app:dev .

# pass-through from current shell env so quotes from `vercel env pull` are stripped
docker run --rm -p 3001:3001 -e SITE_URL -e POSTGRES_URL -e KEYCLOAK_API_URL \
  -e KEYCLOAK_REALM -e KEYCLOAK_ISSUER -e KEYCLOAK_CLIENT_ID \
  -e KEYCLOAK_CLIENT_SECRET -e BAMBOOHR_API_KEY \
  -e INFURA_API_KEY -e GREENHOUSE_API_KEY -e GREENHOUSE_STATUS_BOARD_ID \
  -e GREENHOUSE_LOGOS_BOARD_ID -e GITHUB_TOKEN status-web/status.app:dev
```

> `docker run --env-file` does **not** strip surrounding quotes from values (whereas Next.js / dotenv do). `vercel env pull` writes values quoted. The `start:docker` script sources `.env.local` via shell first, then uses `-e VAR` pass-through to avoid this.

### Build-time vs runtime env

- **Build args** (`docker build --build-arg`): all `NEXT_PUBLIC_*` and Greenhouse board IDs. `NEXT_PUBLIC_*` are inlined into the client bundle during the build.
- **Build secrets** (`docker build --secret id=...,env=...`): `INFURA_API_KEY`, `GREENHOUSE_API_KEY`, `GITHUB_TOKEN`. Passed via BuildKit secret mounts so they are not persisted in image layers; still required at build time for SSG/ISR fetches.
- **Runtime env** (`docker run -e VAR`): everything the running server reads from `process.env`, including `SITE_URL`, `POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY`, and the server-side API keys above (`INFURA_API_KEY`, `GREENHOUSE_*`, `GITHUB_TOKEN`). Server routes and ISR revalidation fetch GitHub releases, Greenhouse jobs, etc. at runtime — these are not baked into the image. Optionally `UMAMI_WEBSITE_ID` / `UMAMI_API_URL`.

### Health endpoint

`GET /api/health` → `{ ok: true, ts: <ms> }`. The Dockerfile's `HEALTHCHECK` polls it every 30s.

### Analytics

Server-side download tracking (`/api/download/*`) previously used `@vercel/analytics/server`. The self-hosted build sends those events to Umami via [`src/server/services/umami.ts`](./src/server/services/umami.ts). Set `UMAMI_WEBSITE_ID` (and optionally `UMAMI_API_URL`) to enable; downloads work fine without it.

### Deployment

This PR ships the image build only. A CI job to publish to a registry (Harbor, GHCR, ECR, etc.) and the runtime orchestration (Kubernetes, Nomad, Docker Compose, etc.) are intentionally not included — those are infra-team concerns and depend on choices outside this repo.

For local builds, see `build:docker` / `start:docker` / `preview:docker` in [`package.json`](./package.json).

### CDN / edge caching

Prerendered pages are served with `Cache-Control: s-maxage=3600, stale-while-revalidate=31532400`. A CDN in front of the container **should honor that for HTML**, not just for `/_next/static/*`.

This matters because the container runs in a single region. When the CDN treats HTML as uncacheable, every reader worldwide pays a full round trip to that region, and mobile LCP crosses the 2.5s Core Web Vitals threshold outside it. Measured from Globalping probes against a single-region origin with HTML uncached at the edge:

| Probe        | HTML (uncached) | `/_next/static` (edge HIT) |
| ------------ | --------------- | -------------------------- |
| London       | 111ms           | 19ms                       |
| Los Angeles  | 272ms           | 20ms                       |
| Singapore    | 328ms           | 22ms                       |
| Johannesburg | 714ms           | 20ms                       |
| Sydney       | 1190ms          | (MISS) 962ms               |

Two things make HTML safe to cache here:

- Only `en` ships, with `localeDetection` and `localeCookie` disabled in [`src/i18n/routing.ts`](./src/i18n/routing.ts), so responses are not per-user and HTML carries no `Set-Cookie`.
- Routes that must stay dynamic already say so — for example `/blog` responds `Cache-Control: private, no-cache, no-store`. A rule that respects the origin's `Cache-Control` will skip them automatically.

One caveat: the same URL returns HTML or an RSC payload (`text/x-component`) depending on the request headers, and the origin sets `Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`. A CDN that ignores `Vary` will eventually serve an RSC payload as a document. Either include those headers in the cache key, or bypass the cache when `rsc` is present.

### Security notes for operators

- **`SITE_URL` is required.** It pins the canonical origin used for OAuth `redirect_uri` and any server-side fetch back into the app. Without it, the app trusts `X-Forwarded-Host` and an attacker can poison that header to redirect OAuth flows or coerce server-side fetches (SSRF). The reverse proxy in front of the container should additionally **strip any inbound `X-Forwarded-*` headers** and set them itself, so external clients can't influence them.
- **Don't bake runtime secrets** (`POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY`) into the image. They're set at `docker run` time via `-e VAR` and never appear in `docker history` or `docker inspect`.
- **`NEXT_PUBLIC_*` values are inlined** into the JS bundle at build time — by design (they're public). Don't put anything private behind a `NEXT_PUBLIC_` name.
- **Build secrets** (Greenhouse, GitHub token, Infura server key) are passed via BuildKit `--secret` mounts during `docker build`. They are not written to image layers, but the build environment itself should still be treated as trusted.
- **Image runs as non-root** (uid 1001) with `tini` as PID 1. The container only exposes port 3001 — no SSH, no shell-by-default.

### Notes for multi-instance deployments

If you run more than one replica behind a load balancer, follow the [Next.js multi-server guide](https://nextjs.org/docs/app/guides/self-hosting#multi-server-deployments):

- Set a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (a base64-encoded 32-byte key) shared across replicas.
- Optionally set `deploymentId` in `next.config.mjs` for version-skew protection during rolling deploys.
- For shared ISR cache across replicas, plug in a [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) (Redis, S3, etc.) — not configured yet.
