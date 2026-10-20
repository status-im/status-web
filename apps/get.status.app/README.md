# get.status.app

Download-focused marketing site at [https://get.status.app](https://get.status.app). It reuses
[`status.app`](../status.app) components, styles and page implementations, scoped to the
get.status.app pages.

## Run

```bash
pnpm --filter get.status.app dev                     # http://localhost:3005
pnpm --filter get.status.app build                   # static export to out/
pnpm --filter get.status.app preview:production      # build + serve out/ on :3005
pnpm --filter get.status.app test:page-source        # assert no status.app marketing copy leaks
```

## Environment

Copy `.env.example` to `.env.local`, or pull from Vercel with `vercel env pull .env.local`.
`CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are optional and only needed for
`pnpm sync:cloudinary`. `env:check` runs automatically before `build`.

## Deploy

Built and deployed by [`ci/website.Jenkinsfile`](../../ci/website.Jenkinsfile) with
`APP_NAME=get.status.app` (branches `deploy-get-status-app-master` / `deploy-get-status-app-develop`,
domains `get.status.app` / `dev-get.status.app`).

## Pages

`/`, `/apps`, `/legal/terms-of-use`, `/legal/privacy-policy`, `/security`. Navigation and footer
only link to routes available on this site (see `src/config/routes.ts`).

## Analytics

Client-side only: Umami (scoped to `get.status.app`), Vercel Analytics, and download `trackEvent`s
from the shared `status.app` components. There is no server-side tracking because production
builds are static exports.

## Shared with status.app

`public` is a symlink to `status.app/public`; `content/legal` holds get.status.app-specific legal
copy. Reused pages resolve `status.app` code through the path aliases defined in `next.config.mjs`.

## Cloudinary

Shares the `status.app` Cloudinary account (`dhgck7ebz`) but keeps its own generated types in
`src/app/_components/assets/types.ts`. Upload get-only assets under the `get.status.app/` folder,
then refresh with `pnpm --filter get.status.app sync:cloudinary` (one-time bootstrap from the
status.app types: `bootstrap:cloudinary`).

## More

- [Agent guide](AGENTS.md)
