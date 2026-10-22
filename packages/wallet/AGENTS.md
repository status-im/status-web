# AGENTS.md

Rules for agents working in `packages/wallet`. The root `AGENTS.md` also applies.

## Role

Private shared wallet logic and UI used by `apps/wallet`, `apps/portfolio`, `apps/hub` and
`apps/api`. Keep it app-agnostic; put app-specific code in the consuming app.

## Commands

- `pnpm --filter @status-im/wallet dev`: Vite library build in watch mode.
- `pnpm --filter @status-im/wallet build`: Vite build plus `tsc` declaration emit.
- `pnpm --filter @status-im/wallet env:check`: validate `.env` against
  `src/config/env.server.mjs`.
- `pnpm --filter @status-im/wallet sync:tokens:erc20` and `sync:cloudinary`: regenerate the
  generated files listed below.

## Rules

- Never hand-edit generated files: `src/constants/erc20.json` (from `sync:tokens:erc20`) and
  `src/components/image/types.ts` (from `sync:cloudinary`). Regenerate them with the scripts.
- The sync scripts read `.env.local` (gitignored): Cloudinary credentials for the image types.
  `.env` (committed, empty values) holds API keys and proxy URLs. Never commit `.env.local`.
- This package is private: consumed through the workspace, never published to npm.
- New public modules are exposed through the subpath export map (`./components`, `./hooks`,
  `./constants`, `./utils`, `./data`, `./tailwind.config`) and the matching library entry in
  `vite.config.ts`; keep both in step.

## Caveats

- Consumers must add `./node_modules/@status-im/wallet/dist/**/*.js` to their Tailwind content so
  classes in this package are collected (see `apps/wallet/tailwind.config.ts`).
- The declared React peer dependency is ^18.2.0; the repo root overrides React to 19.1.2.

## Docs

- [README.md](README.md): run, env, sync and test commands.
