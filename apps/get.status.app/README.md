# get.status.app

Scoped download-focused site that reuses [`status.app`](../status.app) components, styles, and page implementations.

## Pages

- `/` — homepage
- `/apps` — apps
- `/legal/terms-of-use`
- `/legal/privacy-policy`
- `/security`

Navigation and footer only link to routes available on this site (see `src/config/routes.ts`).

## Environment

Environment variables are defined in this app — not the full `status.app` set.

```bash
cd apps/get.status.app
cp .env.example .env.local
```

Or pull from Vercel:

```bash
cd apps/get.status.app
vercel env pull .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | no | `pnpm sync:cloudinary` only |

`pnpm env:check` validates env vars (runs automatically before `pnpm build`).

## Development

```bash
pnpm --filter get.status.app dev
```

Runs on **http://127.0.0.1:3005** (hub uses 3003, status.network uses 3002).

Desktop and APK download buttons fetch the latest GitHub release in the browser on click (1h session cache). App Store and Google Play links go directly to the stores.

## Analytics

Client-side analytics mirror [`status.app`](../status.app):

- **Umami** — loaded in [`src/app/layout.tsx`](./src/app/layout.tsx) from `https://umami.bi.status.im/script.js`, scoped to `get.status.app` via `data-domains`.
- **Vercel Analytics** — `<Analytics />` in the root layout.
- **Custom events** — download clicks call [`trackEvent`](../status.app/src/app/_utils/track.ts) from shared `status.app` components; events are sent to both Vercel Analytics and `window.umami`.

Unlike `status.app`, there is no server-side Umami tracking here: production builds are static (`output: 'export'`) and desktop/APK downloads resolve in the browser instead of via `/api/download/*`.

## Static export (self-hosted)

Production builds use `output: 'export'` and write static files to `out/`.

```bash
pnpm --filter get.status.app build
pnpm --filter get.status.app start   # serves out/ on port 3005
```

Or in one step:

```bash
pnpm --filter get.status.app preview:production
```

`postbuild` runs `next-sitemap`, strips the default locale prefix from `out/`, and copies `serve.json` for `serve` (`cleanUrls`).

Deploy via [`Jenkinsfile.website`](../../Jenkinsfile.website) with `APP_NAME=get.status.app` (branches `deploy-get-status-app-main` / `deploy-get-status-app-develop`, domains `get.status.app` / `dev.get.status.app`).

## Shared assets

- `content/legal` — get.status.app–specific legal copy (not shared with `status.app`)
- `public` → symlink to `status.app/public`

### Cloudinary

Uses the same Cloudinary account and asset ID format as `status.app` (`dhgck7ebz`), but keeps its own generated types in `src/app/_components/assets/types.ts` so new media for this site does not require re-running `status.app`’s sync.

- Reused pages pull IDs from the filtered type union (homepage, apps, download UI, etc.).
- Upload **get-only** assets under the `get.status.app/` folder in Cloudinary.

```bash
# One-time bootstrap from status.app types (no API keys)
pnpm --filter get.status.app bootstrap:cloudinary

# Refresh from Cloudinary (needs CLOUDINARY_* in .env or .env.local)
pnpm --filter get.status.app sync:cloudinary
```
