# AGENTS.md

Rules for agents working in `apps/wallet`. The root `AGENTS.md` also applies.

## Role

Status Portfolio Wallet, a WXT extension for Chrome and Firefox built with React, TanStack Router
and tRPC. It manages wallets, accounts and portfolio views. Mnemonics and private keys must never
leave the background service worker, and must never be logged.

## Commands

- `pnpm --filter wallet dev` (alias of `dev:chrome`): WXT dev server on http://localhost:4000.
- `pnpm --filter wallet dev:chrome` / `dev:firefox`: one browser at a time.
- `pnpm --filter wallet build`: production Chrome build, then `tsc --noEmit`.
- `pnpm --filter wallet build:firefox`, `zip:chrome`, `zip:firefox`: other targets and ZIPs.
- `pnpm --filter wallet test`: vitest.

## Rules

- Do not hand-edit generated files: `src/router.gen.ts` and `src/routeTree.gen.ts` (TanStack Router
  regenerates them on dev and build), and `.wxt/`. Add routes under `src/routes/` instead.
- The tRPC router in `src/data/api.ts` runs inside the background service worker over `trpc-chrome`:
  `createAPI` calls `createChromeHandler`, and `src/entrypoints/background.ts` starts it. The UI
  reaches it through `createAPIClient` (`createTRPCProxyClient`) in
  `src/providers/api-client.tsx`. Throw `TRPCError` there; any other error type reaches the UI as a
  generic failure.
- Calls to the Status API over HTTP go through `src/utils/trpc.ts` to
  `${WXT_STATUS_API_URL}/api/trpc/<endpoint>`. Keep that channel separate from the internal
  chrome-transport router.
- Swap, labelled Exchange in the UI, is a build-time flag: `FEATURE_FLAGS.SWAP` in
  `src/lib/feature-flags.ts` reads `IS_DEVELOPMENT` (`import.meta.env.MODE === 'development'`) from
  `src/lib/environment.ts`. Production builds always hide it, so do not gate it on runtime Chrome
  state.

## Caveats

- Env values live in the committed `.env.development` and `.env.production`. WXT exposes only
  variables prefixed with `WXT_`.
- Load the unpacked extension from `.output/chrome-mv3`. It is gitignored, and Finder hides
  dotfiles (Command + Shift + .).
- `postinstall` runs `wxt prepare`. Run it again after adding or renaming entrypoints, or the
  `.wxt` types go stale.

## Docs

- [README.md](README.md): run, build and Chrome Web Store release steps.
