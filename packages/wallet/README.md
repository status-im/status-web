# @status-im/wallet

Private package of shared wallet logic and UI: components, hooks, data clients, constants and
utilities. Consumed by `apps/wallet`, `apps/portfolio`, `apps/hub` and `apps/api`; it is never
published to npm.

## Run

    pnpm --filter @status-im/wallet dev       # Vite library build in watch mode
    pnpm --filter @status-im/wallet build     # Vite build plus type declarations
    pnpm --filter @status-im/wallet typecheck
    pnpm --filter @status-im/wallet test

## Environment

Fill the API keys and proxy URLs in `.env` (committed with empty values). The sync scripts below
read `.env.local` instead, which is gitignored.

## Sync

    pnpm --filter @status-im/wallet sync:tokens:erc20   # regenerates src/constants/erc20.json
    pnpm --filter @status-im/wallet sync:cloudinary     # regenerates src/components/image/types.ts

Both scripts overwrite committed, generated files, so run them with the matching `.env.local`
keys (Cloudinary credentials for `sync:cloudinary`).

## More

- [Agent guide](AGENTS.md)
