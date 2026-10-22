# wallet

Rules for agents working in `packages/wallet`. The root [AGENTS.md](../../AGENTS.md) applies too. This is the private package behind the wallet UI and the portfolio data layer; `apps/wallet`, `apps/portfolio` and `apps/api` import it through the workspace.

## Commands

- `pnpm --filter @status-im/wallet dev`: Vite build in watch mode.
- `pnpm --filter @status-im/wallet build`: Vite build plus `tsc` declarations.
- `pnpm --filter @status-im/wallet test`: vitest with happy-dom.
- `pnpm --filter @status-im/wallet env:check`: validate `.env` against `src/config/env.server.mjs`.
- `pnpm --filter @status-im/wallet sync:tokens:erc20` and `sync:cloudinary`: regenerate the generated files.

## Rules

- Never hand-edit `src/constants/erc20.json` or `src/components/image/types.ts`. Regenerate them with the scripts, which read `.env.local` and overwrite the files.
- Keep secrets out of git. `.env` is committed with empty values; `.env.local` stays gitignored.
- Put app-specific UI in the app. This package holds what at least two consumers need.
- Expose a new module through both the subpath map in `package.json` and the matching library entry in [vite.config.ts](./vite.config.ts). Miss one and either the import or the types break.

## Caveats

- `src/config/env.server.mjs` throws when a browser imports it. The service clients under `src/data` read server secrets, so keep them in server components, route handlers or the app's tRPC layer.
- Consumers must add `./node_modules/@status-im/wallet/dist/**/*.js` to their Tailwind `content`. `apps/portfolio` also extends the preset in `@status-im/wallet/tailwind.config`.
- The declared React peer is ^18.2.0, while the repo root overrides React to 19.1.2. Do not let a React 19 API leak into the exported types.
- The package is private, so never add a publish step.

## Docs

- [README.md](./README.md): subpaths, env, generated files and commands.
