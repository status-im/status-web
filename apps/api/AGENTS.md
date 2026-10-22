# AGENTS.md

Rules for agents working in `apps/api`. The root `AGENTS.md` also applies.

## Role

Hosts the tRPC `apiRouter` from `@status-im/wallet/data` over HTTP, plus a JSON-RPC proxy. Port 3030. Its only route is the `/api/trpc` handler; there is no UI and no root page.

## Commands

- `pnpm --filter api dev`: dev server on :3030.
- `pnpm --filter api build`: `next build`.
- `pnpm --filter api test`: vitest (route handler tests).
- `pnpm --filter api typecheck`: tsc.
- `pnpm --filter api env:check`: validate `.env` against `src/config/env.server.mjs`.

## Rules

- The router lives in `packages/wallet/src/data/api` (`@status-im/wallet/data`), not here. Add or
  change procedures there; this app only serves it and wraps the JSON-RPC proxy.
- The handler at `src/app/api/trpc/[trpc]/route.ts` sets caching, `Retry-After` and CORS headers
  per procedure. Keep the `responseMeta` procedure lists in sync when adding procedures that must
  bypass the cache.
- `env:check` runs before builds and via lint-staged. Keep the Zod schema in
  `src/config/env.server.mjs` in sync with `.env`.
- The API is consumed by `apps/wallet` (`WXT_STATUS_API_URL`) and `apps/hub`
  (`NEXT_PUBLIC_STATUS_API_URL`). Do not break the tRPC response shape (`result.data.json`).

## Caveats

- `vercel.json` caps `app/api/**/*` at `maxDuration` 800 seconds on Vercel.
- CORS is permissive (`Access-Control-Allow-Origin: *`) on purpose; this is a public read layer.
- `.env` is committed with empty defaults. Put real values in `.env.local` (gitignored); never
  commit secrets.

## Docs

- No `docs/` folder in this workspace. The router reference lives in `packages/wallet`.
