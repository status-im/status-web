# AGENTS.md

Rules for agents working in `apps/get.status.app`. The root `AGENTS.md` also applies.

## Role

Static, download-focused companion to `status.app`. It reuses `status.app` components through path
aliases and builds to a static export served from `out/`. Port 3005.

## Commands

- `pnpm --filter get.status.app dev`: dev server on :3005.
- `pnpm --filter get.status.app build`: static export (`output: 'export'`) to `out/`.
- `pnpm --filter get.status.app preview:production`: build + serve `out/` on :3005.
- `pnpm --filter get.status.app test:page-source`: assert no status.app marketing copy leaks.
- `pnpm --filter get.status.app env:check`: validate `.env` (runs before `build`).
- `pnpm --filter get.status.app sync:cloudinary` / `bootstrap:cloudinary`.

## Rules

- This is a static export. Do not add server routes, middleware or server-side data fetching;
  everything must run in the browser or at build time.
- `postbuild` runs `next-sitemap`, strips the default `en` locale prefix from `out/`, and copies
  `serve.json`, the app icon and `llms.txt` into `out/`. Keep that ordering.
- `llms.txt` and `content/legal` are published site content. Do not edit them as part of docs work.
- Do not hand-edit `src/app/_components/assets/types.ts`; regenerate via `sync:cloudinary` (needs
  `CLOUDINARY_*`) or `bootstrap:cloudinary` (copies the filtered status.app set, no keys).
- Analytics are client-side only. Do not add server-side tracking: it cannot fire in a static
  export.

## Gotchas

- `public` is a symlink to `status.app/public`. Keep it a symlink.
- Reused `status.app` pages resolve through aliases in `next.config.mjs` (`~components`, `~website`,
  `~server`, `~`); changes to those shared files affect this site, so run `test:page-source`.
- Desktop and APK download buttons resolve the latest GitHub release in the browser; there is no
  `/api/download/*` here.

## Docs

- No `docs/` folder in this workspace. Cross-app detail lives in the root `docs/` and
  `apps/status.app/docs/`.
