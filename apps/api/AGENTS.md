# AGENTS.md

Rules for agents working in `apps/api`. The root `AGENTS.md` also applies.

## Role

Serves the tRPC `apiRouter` from `@status-im/wallet/data` over HTTP, plus a JSON-RPC proxy, on port 3030. `/api/trpc` is the only route: no UI, no root page.

## Commands

- `pnpm --filter api dev`: dev server on :3030.
- `pnpm --filter api build`: `next build`.
- `pnpm --filter api test`: vitest, covering the route handler.
- `pnpm --filter api typecheck`: tsc.
- `pnpm --filter api env:check`: validate `.env` against `src/config/env.server.mjs`.

## Rules

- The router lives in `packages/wallet/src/data/api` (`@status-im/wallet/data`), not here. Add or
  change procedures there and keep this app a thin adapter around `rpc.proxy`.
- [`route.ts`](src/app/api/trpc/%5Btrpc%5D/route.ts) sets caching, `Retry-After` and CORS headers per
  procedure. When you add a procedure that must not be cached, add it to the `responseMeta` list in
  the same file.
- Keep the Zod schema in `src/config/env.server.mjs` in step with `.env`, and run `env:check` after
  touching either. Nothing else runs it for you.
- `apps/wallet` (`WXT_STATUS_API_URL`) and `apps/hub` (`NEXT_PUBLIC_STATUS_API_URL`) read this API
  over HTTP. Do not change the tRPC response shape (`result.data.json`); the JSON-RPC proxy depends
  on it too.

## Caveats

- CORS is `Access-Control-Allow-Origin: *` on purpose. Everything here is public read traffic, so
  do not tighten it without a plan for the extensions.
- `vercel.json` caps `app/api/**/*` at `maxDuration` 800 seconds.
- `.env` holds names and empty defaults; real values belong in `.env.local`. See [README.md](README.md).

## Docs

- No `docs/` folder here; the router reference lives in `packages/wallet`.
