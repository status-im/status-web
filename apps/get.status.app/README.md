# get.status.app

Download-focused marketing site at <https://get.status.app>. It reuses the pages, components and styles of [`status.app`](../status.app), narrowed to the routes that exist in [`src/app`](src/app).

## Run

    pnpm --filter get.status.app dev                     # http://localhost:3005
    pnpm --filter get.status.app build                   # static export into out/
    pnpm --filter get.status.app preview:production      # build then serve out/ on :3005
    pnpm --filter get.status.app test:page-source        # assert no status.app marketing copy leaks

## Environment

Copy `.env.example` to `.env.local`, or pull from Vercel with `vercel env pull .env.local`. `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are optional and only used by `sync:cloudinary`. `env:check` runs before `build`.

## Deploy

Built and deployed by [`ci/website.Jenkinsfile`](../../ci/website.Jenkinsfile) with `APP_NAME=get.status.app`: branch `deploy-get-status-app-master` publishes get.status.app, `deploy-get-status-app-develop` publishes dev-get.status.app.

## Pages

`/`, `/apps`, `/legal/terms-of-use` and `/legal/privacy-policy`, plus the catch-all 404. The header, footer and promo bar come from status.app and check `isGetSite` in `src/config/site-scope.ts` to hide links to pages this site does not have. `src/config/routes.ts` holds the app route list.

## Analytics

All client-side: Umami scoped to `get.status.app`, Vercel Analytics, and the `trackEvent` calls inside the shared status.app download components. Server-side tracking cannot work in a static export.

## Shared with status.app

`public` is a symlink to `status.app/public` and `content/legal` holds the get.status.app legal copy. Reused pages resolve status.app code through the path aliases in `next.config.mjs`.

## Cloudinary

The site uses the status.app Cloudinary account (`dhgck7ebz`) with its own generated types in `src/app/_components/assets/types.ts`. Upload get-only assets under the `get.status.app/` folder, then refresh with `pnpm --filter get.status.app sync:cloudinary`. The one-time bootstrap from the status.app types is `bootstrap:cloudinary`.

## More

- [Agent guide](AGENTS.md): commands, rules and caveats for coding agents.
