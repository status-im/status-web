# AGENTS.md

Rules for agents working in `apps/get.status.app`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The download-focused companion site to status.app on port 3005. It reuses status.app pages and components through the aliases in [`next.config.mjs`](next.config.mjs) and builds to a static export in `out/`.

## Commands

- `pnpm --filter get.status.app dev`: dev server on :3005.
- `pnpm --filter get.status.app build`: static export to `out/`.
- `pnpm --filter get.status.app preview:production`: build and serve `out/` on :3005.
- `pnpm --filter get.status.app test:page-source`: assert no status.app marketing copy leaks.
- `pnpm --filter get.status.app env:check`: validate env from `.env` (runs before `build`).
- `pnpm --filter get.status.app sync:cloudinary` and `bootstrap:cloudinary`: regenerate the Cloudinary asset types.

## Rules

- This is a static export. Do not add server routes or server-side data fetching; everything runs in the browser or at build time. `src/middleware.ts` only exists for locale routing in dev and does not run in the export.
- `postbuild` runs `next-sitemap`, strips the default `en` prefix from `out/`, then copies `serve.json`, the app icon and `llms.txt` into `out/`. Keep that order.
- `llms.txt` and `content/legal` are published site content. Do not edit them as part of docs work.
- Do not hand-edit `src/app/_components/assets/types.ts`. Regenerate it with `sync:cloudinary` (needs `CLOUDINARY_*` in `.env.local`) or `bootstrap:cloudinary` (copies the filtered status.app set, no keys).
- Keep analytics client-side. Server-side tracking cannot fire in a static export.
- Keep `public` a symlink to `status.app/public`.

## Caveats

- Reused status.app pages resolve through the aliases in `next.config.mjs` (`~components`, `~website`, `~server`, `~`). A change to those shared files changes this site too, so run `test:page-source` after touching them.
- The desktop and APK download buttons fetch the latest `status-im/status-app` release from the GitHub API in the browser and fall back to the releases page. This app has no `/api/download/*` route, unlike status.app.
- The shared header and footer hide status.app links through `isGetSite` in `src/config/site-scope.ts`; a new link needs that check if the target page does not exist here.

## Docs

- No `docs/` folder in this workspace. Cross-app detail lives in the root `docs/` and `apps/status.app/docs/`.
