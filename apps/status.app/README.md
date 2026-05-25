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

The production build uses Next.js [`output: 'standalone'`](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) and runs `node server.js` in a slim Alpine container.

### Required external services

The container does **not** include Postgres or Keycloak — both are pointed at external instances via env vars:

- **Postgres** — `POSTGRES_URL` (any standard Postgres connection string)
- **Keycloak** — `KEYCLOAK_API_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`

See [`.env.example`](./.env.example) for the full list.

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
  --build-arg NEXT_PUBLIC_GHOST_API_URL=... \
  --build-arg NEXT_PUBLIC_GHOST_API_KEY=... \
  # ...other --build-arg NEXT_PUBLIC_* / INFURA_API_KEY / GREENHOUSE_* / GITHUB_TOKEN
  -t status-web/status.app:dev .

# pass-through from current shell env so quotes from `vercel env pull` are stripped
docker run --rm -p 3001:3001 -e POSTGRES_URL -e KEYCLOAK_API_URL -e KEYCLOAK_REALM \
  -e KEYCLOAK_ISSUER -e KEYCLOAK_CLIENT_ID -e KEYCLOAK_CLIENT_SECRET \
  -e BAMBOOHR_API_KEY status-web/status.app:dev
```

> `docker run --env-file` does **not** strip surrounding quotes from values (whereas Next.js / dotenv do). `vercel env pull` writes values quoted. The `start:docker` script sources `.env.local` via shell first, then uses `-e VAR` pass-through to avoid this.

### Build-time vs runtime env

- **Build args** (`docker build --build-arg`): all `NEXT_PUBLIC_*`, plus `INFURA_API_KEY`, `GREENHOUSE_*`, `GITHUB_TOKEN`. These are needed during SSG/ISR fetches; `NEXT_PUBLIC_*` are inlined into the client bundle.
- **Runtime env** (`docker run --env`): `POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY`, and optionally `UMAMI_WEBSITE_ID`. Never bake these into the image.

### Health endpoint

`GET /api/health` → `{ ok: true, ts: <ms> }`. The Dockerfile's `HEALTHCHECK` polls it every 30s.

### Analytics

Server-side download tracking (`/api/download/*`) previously used `@vercel/analytics/server`. The self-hosted build sends those events to Umami via [`src/server/services/umami.ts`](./src/server/services/umami.ts). Set `UMAMI_WEBSITE_ID` (and optionally `UMAMI_API_URL`) to enable; downloads work fine without it.

### Deployment

This PR ships the image build only. A CI job to publish to a registry (Harbor, GHCR, ECR, etc.) and the runtime orchestration (Kubernetes, Nomad, Docker Compose, etc.) are intentionally not included — those are infra-team concerns and depend on choices outside this repo.

For local builds, see `build:docker` / `start:docker` / `preview:docker` in [`package.json`](./package.json).

### Security notes for operators

- **`SITE_URL` is required.** It pins the canonical origin used for OAuth `redirect_uri` and any server-side fetch back into the app. Without it, the app trusts `X-Forwarded-Host` and an attacker can poison that header to redirect OAuth flows or coerce server-side fetches (SSRF). The reverse proxy in front of the container should additionally **strip any inbound `X-Forwarded-*` headers** and set them itself, so external clients can't influence them.
- **Don't bake runtime secrets** (`POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY`) into the image. They're set at `docker run` time via `-e VAR` and never appear in `docker history` or `docker inspect`.
- **`NEXT_PUBLIC_*` values are inlined** into the JS bundle at build time — by design (they're public). Don't put anything private behind a `NEXT_PUBLIC_` name.
- **Build-arg secrets** (Greenhouse, GitHub token, Infura server key) are visible to BuildKit and may end up in the build cache. They're scoped to the build stage and dropped before the runtime image, but treat the build environment itself as trusted.
- **Image runs as non-root** (uid 1001) with `tini` as PID 1. The container only exposes port 3001 — no SSH, no shell-by-default.

### Notes for multi-instance deployments

If you run more than one replica behind a load balancer, follow the [Next.js multi-server guide](https://nextjs.org/docs/app/guides/self-hosting#multi-server-deployments):

- Set a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (a base64-encoded 32-byte key) shared across replicas.
- Optionally set `deploymentId` in `next.config.mjs` for version-skew protection during rolling deploys.
- For shared ISR cache across replicas, plug in a [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) (Redis, S3, etc.) — not configured yet.
