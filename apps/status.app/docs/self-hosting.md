# Self-hosting status.app

What an operator needs to build and run the `apps/status.app` Docker image, and why the environment
variables, cache headers and security settings have to look the way they do. The code involved is
[`Dockerfile`](../Dockerfile), the `build:docker` / `start:docker` / `preview:docker` scripts in
[`package.json`](../package.json), [`next.config.mjs`](../next.config.mjs),
[`src/config/env.server.mjs`](../src/config/env.server.mjs) and
[`src/app/api/health/route.ts`](../src/app/api/health/route.ts).

## Why a Node runtime

`apps/hub`, `apps/status.network` and `apps/get.status.app` export to static files. status.app
cannot: public API routes, ISR, middleware and server actions need a process. The image therefore ships Next.js `output: 'standalone'` and runs
`node apps/status.app/server.js` in a `node:22-slim` Debian container (`ARG NODE_VERSION=22.13.1`).

The base image is Debian slim, not Alpine, because several native modules in the workspace (keccak,
`unrs-resolver`) publish glibc-only binaries and would compile from source on musl.

## Services the image expects

The public site uses Ghost, GitHub, Greenhouse, Infura and Hasura. [`.env.example`](../.env.example)
lists the configuration for those services and optional Umami analytics.

We removed the admin screens, the Keycloak login routes, the admin-only tRPC services and the
Postgres integration. The website does not need Postgres, Keycloak or BambooHR at build time or at
runtime. Public Insights still use Hasura through
[`src/app/(website)/insights/_graphql`](<../src/app/(website)/insights/_graphql>).

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

## Building while Ghost is down

The build runs
[`scripts/generate-blog-search-index.ts`](../scripts/generate-blog-search-index.ts), which fails
with "Cannot generate an empty blog search index" when Ghost returns no posts. During a Ghost outage
that blocks every build, including one you need for an unrelated fix such as rotating
`GITHUB_TOKEN`.

Set `ALLOW_EMPTY_BLOG_SEARCH_INDEX=1` for the build to get past it:

```bash
ALLOW_EMPTY_BLOG_SEARCH_INDEX=1 pnpm --filter status.app build
```

With the flag set, the script logs a warning and writes an empty `public/blog-search-index.json`
instead of throwing. Blog search returns no results until the next build with Ghost back up. The
homepage hides its blog section when Ghost returns no posts.

`turbo.json` lists `ALLOW_EMPTY_BLOG_SEARCH_INDEX` in the `status.app#build` hash, so a build
without the flag does not reuse a cached empty index.

This change did not touch the `Dockerfile` or the `build:docker` script, so check that they pass
`ALLOW_EMPTY_BLOG_SEARCH_INDEX` into `docker build` before you rely on it for an image build.

## Serving requests while Ghost is down

The [Ghost client](<../src/app/(website)/_lib/ghost/client.ts>) gives server-side requests three
seconds and bulk requests (including the search index build) ten seconds. Browser fetches keep
their existing behavior.

The [Ghost cache](<../src/app/(website)/_lib/ghost/cache.ts>) stores results, including failures,
for the blog listing and feeds in the Next.js Data Cache for 60 seconds. The home page uses
hourly ISR and can regenerate without the blog section during an outage. The sitemap uses
hourly ISR with cached Ghost requests for both blog and Learn entries.

On Vercel, [the project configuration](../vercel.json) enables Fluid Compute for status.app
deployments and sets a 15-second execution limit for App Router functions. This bills active CPU
time separately from provisioned memory time.

## Feed snapshots

Production builds serve committed XML in [public/feeds](../public/feeds) at the original URLs
using [Next.js rewrites](../next.config.mjs). A snapshot is served directly and never queries
Ghost at request time. Readers pick up updates when refreshed snapshots are deployed.

The current snapshots are the public [RSS capture from July 15, 2026][rss-capture] and
[Atom capture from October 6, 2026][atom-capture]. The desktop and mobile news feeds
still use their live handlers until valid snapshots are available for each version.

To refresh when Ghost is healthy, start the app with the real Ghost configuration and
`NEXT_PUBLIC_VERCEL_ENV=production` so feed links use `https://status.app`. Local development
serves the live feeds. In another terminal, capture and review the XML, then commit it and deploy.

```bash
NEXT_PUBLIC_VERCEL_ENV=production pnpm --filter status.app dev:next
pnpm --filter status.app capture:feeds http://localhost:3001
```

[The capture script](../scripts/capture-feed-snapshots.mjs) also accepts a directory of
[feed files](../scripts/feed-snapshots.mjs) and optional URL paths to capture a subset.
It validates that every requested file is nonempty XML in the expected feed format before
replacing any files.

For routes without a snapshot, the CDN can serve a previous successful response stale after
an error. Without a usable cached response, these routes return `503` with `Retry-After: 60`.
Both versions of each app news feed share an upstream cache entry.

[rss-capture]: https://web.archive.org/web/20260715164449id_/https://status.app/rss
[atom-capture]: https://web.archive.org/web/20261006204929id_/https://status.app/feed.xml

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

Runtime env (`docker run -e VAR`): the server-side keys above, plus `UMAMI_WEBSITE_ID` and
`UMAMI_API_URL` if you want download analytics. Server routes and ISR
revalidation fetch GitHub releases and Greenhouse jobs at runtime, so those values are not baked in.

[`src/config/env.server.mjs`](../src/config/env.server.mjs) validates the public-service keys with
the same schema for builds and runtime. Public canonical URLs use
[`src/config/site.ts`](../src/config/site.ts).

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

The removed `/admin` and `/login/keycloak/*` routes return 404. The website no longer exposes admin
authentication or admin write operations. Let the reverse proxy strip inbound `X-Forwarded-*` headers and set
them itself.

Remove unused Keycloak, BambooHR and Postgres secrets from website deployment settings.

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
