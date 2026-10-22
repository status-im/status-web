# AGENTS.md

Rules for agents working in `apps/wallet`. The root `AGENTS.md` also applies.

## Role

Status Portfolio Wallet, a WXT browser extension for Chrome and Firefox built with React, TanStack
Router and tRPC. It manages wallets, accounts and portfolio views, and must never expose or log
secret material (mnemonics, private keys) outside the background service worker.

## Commands

- `pnpm --filter wallet dev` (alias of `dev:chrome`): WXT dev server on http://localhost:4000.
- `pnpm --filter wallet dev:chrome` / `dev:firefox`: per-browser dev builds.
- `pnpm --filter wallet build`: production Chrome build plus a `tsc --noEmit` type check.
- `pnpm --filter wallet build:firefox`, `zip:chrome`, `zip:firefox`: other targets and ZIP packages.
- `pnpm --filter wallet test`: Vitest.

## Rules

- Never hand-edit generated files: `src/router.gen.ts` and `src/routeTree.gen.ts` (TanStack Router
  route trees, regenerated on build or dev) and `.wxt/` (WXT generated types). Edit routes under
  `src/routes/` instead.
- The tRPC router in `src/data/api.ts` is served from the background service worker via
  `trpc-chrome` (`createChromeHandler`, called by `createAPI` in `src/entrypoints/background.ts`).
  The UI calls it through `createTRPCProxyClient` (`createAPIClient` in
  `src/providers/api-client.tsx`). Throw `TRPCError` so error messages survive the chrome
  transport; other error types collapse to a generic one.
- HTTP tRPC calls to the Status API go through `src/utils/trpc.ts` and target
  `${WXT_STATUS_API_URL}/api/trpc/<endpoint>`. Keep this channel separate from the internal
  chrome-transport router.
- Swap (labelled Exchange in the UI) is gated in `src/lib/feature-flags.ts` on
  `import.meta.env.MODE === 'development'` only, at build time. Do not gate it on runtime Chrome
  state; production builds always hide it.

## Caveats

- Env vars live in the committed `.env.development` and `.env.production` (`WXT_STATUS_API_URL`).
  WXT only exposes vars prefixed with `WXT_`.
- Load the unpacked extension from `.output/chrome-mv3`; it is gitignored, and Finder hides hidden
  files (press Command + Shift + .).
- `postinstall` runs `wxt prepare`; run it after adding or renaming entrypoints or the `.wxt`
  types go stale.

## Docs

- [README.md](README.md): run, build and Chrome Web Store release steps.
