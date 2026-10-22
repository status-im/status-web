# Self-hosting status.app

What an operator needs to build and run the `apps/status.app` Docker image, and why the environment
variables, cache headers and security settings have to look the way they do. The code involved is
[`Dockerfile`](../Dockerfile), the `build:docker` / `start:docker` / `preview:docker` scripts in
[`package.json`](../package.json), [`next.config.mjs`](../next.config.mjs),
[`src/config/env.server.mjs`](../src/config/env.server.mjs) and
[`src/app/api/health/route.ts`](../src/app/api/health/route.ts).

## Why a Node runtime

`apps/hub`, `apps/status.network` and `apps/get.status.app` export to static files. status.app
cannot: API routes, ISR, middleware, server actions, the Postgres-backed admin and the Keycloak
login all need a process. The image therefore ships Next.js `output: 'standalone'` and runs
`node apps/status.app/server.js` in a `node:22-slim` Debian container (`ARG NODE_VERSION=22.13.1`).

The base image is Debian slim, not Alpine, because several native modules in the workspace (keccak,
`unrs-resolver`) publish glibc-only binaries and would compile from source on musl.

## Services the image expects

Postgres and Keycloak are not in the image. Point it at instances you run:

- Postgres: `POSTGRES_URL`, any standard connection string.
- Keycloak: `KEYCLOAK_API_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`,
  `KEYCLOAK_CLIENT_SECRET`.

[`.env.example`](../.env.example) lists every variable and says when it is needed.

## Content submodules

`content/specs` is a git submodule (`status-im/status-specs`). The build copies `apps/status.app/`
as it is, so the build host has to check the submodule out first:

```bash
git submodule update --init --recursive
```

[`scripts/ensure-specs-content.mjs`](../scripts/ensure-specs-content.mjs) runs before Contentlayer.
It initializes the submodule if it can, shallow-clones the specs repo when there is no parent
repository to ask, and otherwise fails the build. Failing is deliberate: an empty `content/specs`
compiles fine and ships a `/specs` hub whose every detail URL 404s, which is how the specs section
once went down in production.

## Build and run locally

From `apps/status.app`:

```bash
cp .env.example .env.local   # fill in values
pnpm preview:docker          # build the image, then run it on :3001
```

Or keep the two steps apart:

```bash
pnpm build:docker
pnpm start:docker
```

Both scripts wrap `docker build` with the monorepo root as context. The three secrets
(`INFURA_API_KEY`, `GREENHOUSE_API_KEY`, `GITHUB_TOKEN`) arrive as BuildKit `--secret` mounts; the
`NEXT_PUBLIC_*` values and the Greenhouse board IDs arrive as `--build-arg`.

`start:docker` sources `.env.local` and passes each variable with `-e VAR` rather than handing the
file to `docker run --env-file`. `--env-file` keeps the surrounding quotes in a value, while
Next.js and dotenv strip them, and `vercel env pull` writes quoted values. Sourcing first and
passing the names through avoids that mismatch.

## Which variables go where

Build args (`docker build --build-arg`): all `NEXT_PUBLIC_*` values and the Greenhouse board IDs.
Anything with a `NEXT_PUBLIC_` prefix is inlined into the client bundle during the build, so it
cannot be changed later.

Build secrets (`docker build --secret id=...,env=...`): `INFURA_API_KEY`, `GREENHOUSE_API_KEY`,
`GITHUB_TOKEN`. Secret mounts keep them out of the image layers, but they are still needed at build
time, because SSG and ISR fetch from GitHub and Greenhouse while the build runs.

Runtime env (`docker run -e VAR`): everything the server reads from `process.env`, including
`SITE_URL`, `POSTGRES_URL`, `KEYCLOAK_*`, `BAMBOOHR_API_KEY` and the server-side keys above, plus
`UMAMI_WEBSITE_ID` and `UMAMI_API_URL` if you want download analytics. Server routes and ISR
revalidation fetch GitHub releases and Greenhouse jobs at runtime, so those values are not baked in.

[`src/config/env.server.mjs`](../src/config/env.server.mjs) knows the difference: during
`next build` (`NEXT_PHASE === 'phase-production-build'`) the runtime-only variables are optional,
and afterwards they are required. `SITE_URL` is required only on a self-hosted production run,
which is why a Vercel build does not need it.

## Health endpoint

`GET /api/health` answers `{ ok: true, ts: <ms> }`. The Dockerfile `HEALTHCHECK` polls it every 30
seconds. It stays cheap on purpose: no database query, no external fetch, so a failing probe means
the server is gone and not that a dependency is slow.

## Analytics

Download tracking (`/api/download/*`) used `@vercel/analytics/server`. The self-hosted build sends
the same events to Umami through [`src/server/services/umami.ts`](../src/server/services/umami.ts).
Set `UMAMI_WEBSITE_ID` to turn it on, `UMAMI_API_URL` to point at your instance. Downloads work
without either; they just go uncounted.

## Publishing the image

[`ci/docker.Jenkinsfile`](../../../ci/docker.Jenkinsfile) builds the image and pushes it to Harbor
(`harbor.status.im`) as `status-web/status-app`, tagged with the short commit SHA plus
`deploy-master` or `deploy-develop`. What runs that image (Kubernetes, Nomad, Compose) is not in
this repo and depends on the infrastructure team.

## CDN and edge caching

Prerendered pages go out with `Cache-Control: s-maxage=3600, stale-while-revalidate=31532400`. A CDN
in front of the container should apply that to HTML, not only to `/_next/static/*`.

The container runs in one region, so an edge that treats HTML as uncacheable makes every reader
outside it pay a full round trip, and mobile LCP crosses the 2.5s Core Web Vitals threshold. These
were Globalping probes against a single-region origin with HTML uncached at the edge:

| Probe        | HTML (uncached) | `/_next/static` (edge HIT) |
| ------------ | --------------- | -------------------------- |
| London       | 111ms           | 19ms                       |
| Los Angeles  | 272ms           | 20ms                       |
| Singapore    | 328ms           | 22ms                       |
| Johannesburg | 714ms           | 20ms                       |
| Sydney       | 1190ms          | (MISS) 962ms               |

Two things make HTML safe to cache here. Only `en` ships, with `localeDetection` and `localeCookie`
off in [`src/i18n/routing.ts`](../src/i18n/routing.ts), so a response does not depend on the reader
and HTML carries no `Set-Cookie`. Routes that must stay dynamic say so themselves: `/blog` reads
`searchParams` and is served `Cache-Control: private, no-cache, no-store`, which a rule that honors
the origin header skips automatically.

The caveat is `Vary`. The same URL returns HTML or an RSC payload (`text/x-component`) depending on
the request headers, and the origin sets `Vary: rsc, next-router-state-tree, next-router-prefetch,
next-router-segment-prefetch`. A CDN that ignores `Vary` will eventually serve an RSC payload as a
document. Include those headers in the cache key, or bypass the cache when `rsc` is present.

## Security for operators

`SITE_URL` is not optional in production. It pins the canonical origin used for OAuth
`redirect_uri` and for server-side fetches back into the app. Without it the app falls back to
`X-Forwarded-Host`, and anyone who can set that header can redirect OAuth flows or steer
server-side fetches at a host of their choosing. Let the reverse proxy strip inbound
`X-Forwarded-*` headers and set them itself.

Keep `POSTGRES_URL`, `KEYCLOAK_*` and `BAMBOOHR_API_KEY` out of the image. Pass them at `docker run`
time with `-e VAR` and they stay absent from `docker history` and `docker inspect`.

`NEXT_PUBLIC_*` values are inlined into the JavaScript bundle, by design. Nothing private belongs
behind a `NEXT_PUBLIC_` name.

Build secrets reach the image through BuildKit mounts only, so they never land in a layer. Treat
the build machine as trusted anyway.

The container runs as uid 1001 under `tini` as PID 1, exposes only 3001, and writes its ISR cache
under `apps/status.app/.next`, which the image creates with the right owner.

## More than one replica

Behind a load balancer, follow the
[Next.js multi-server guide](https://nextjs.org/docs/app/guides/self-hosting#multi-server-deployments):

- Set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` to the same base64-encoded 32-byte key on every replica.
- Optionally set `deploymentId` in `next.config.mjs` for version-skew protection during a rolling
  deploy.
- To share the ISR cache between replicas, plug in a
  [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath)
  backed by Redis, S3 or similar. Nothing like that is configured yet; each replica keeps its own
  cache.
