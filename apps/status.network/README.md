# Status Network Website

This is the source for <https://status.network> – a [Next.js](https://nextjs.org/) project with static export.

## Prerequisites

*   **[Node.js](https://nodejs.org/en/)** `v22.x`
*   **[pnpm](https://pnpm.io)** v9.12.x
*   **[perl](https://www.perl.org/)** v5.36.x (for `postbuild` locale stripping)

From the **repo root**, install dependencies and submodules:

```bash
pnpm install
git submodule update --init --recursive apps/status.network/content/legal-external
```

## Environment

Blog and static export need Ghost Content API credentials.

```bash
cd apps/status.network
cp .env.example .env.local
# Fill GHOST_API_KEY and NEXT_PUBLIC_GHOST_API_KEY (same value)
```

Or pull from Vercel:

```bash
cd apps/status.network
vercel env pull .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `GHOST_API_URL` | optional (defaults to `https://our.status.im`) | Server fetch at build/dev |
| `GHOST_API_KEY` | **yes** for `pnpm build` | Pre-render `/blog` pages |
| `NEXT_PUBLIC_GHOST_API_URL` | recommended | Client refresh after deploy |
| `NEXT_PUBLIC_GHOST_API_KEY` | recommended | Client refresh after deploy |

Optional: refresh committed slug list (used if the API returns no posts during build):

```bash
pnpm sync:blog-slugs
```

## Development (`next dev`)

Middleware and i18n run normally (no static export in dev).

```bash
cd apps/status.network
pnpm dev
```

Open <http://localhost:3002>.

Without Ghost env vars, marketing pages work; `/blog` lists no posts and client refresh is skipped.

## Production-like local preview (static export)

Simulates Jenkins self-hosted output: `next build` → `out/` → static file server.

```bash
cd apps/status.network
pnpm preview:production
```

This runs `prebuild` (env check + legal dates), `build`, sitemap, locale stripping, copies `serve.json` into `out/`, then serves on <http://localhost:3002>.

Stop `pnpm dev` first if port 3002 is already in use (otherwise `serve` picks another port).

Steps separately:

```bash
pnpm build   # writes to out/
pnpm start   # serve out/ on port 3002
```

## Deploying

Deployment is handled via [`Jenkinsfile.website`](../../Jenkinsfile.website). Jenkins sets `GHOST_*` and `NEXT_PUBLIC_GHOST_*` from the same parameters when building `status.network`.
