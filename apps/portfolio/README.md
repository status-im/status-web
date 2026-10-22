# portfolio

The Status portfolio: a Next.js app on port 3004 for viewing and managing Ethereum assets and
collectibles across several addresses and networks. The data layer and most of the UI come from
`@status-im/wallet`.

## Run

Run from the repo root:

```bash
pnpm --filter portfolio dev     # http://localhost:3004, with Turbopack
pnpm --filter portfolio build   # production build
pnpm --filter portfolio start   # serve the build
```

## Environment

`.env` is committed with defaults. Pull the secrets locally:

```bash
vercel env pull .env.local
```

`src/config/env.server.mjs` and `src/config/env.client.mjs` are Zod schemas over the values you
need (Infura, Alchemy, CoinGecko, Mercuryo and the RPC proxy credentials). The server schema is
imported by `next.config.mjs`, so a missing variable stops the build.
`pnpm --filter portfolio env:check` runs both schemas against `.env` on their own.

## Deploy

Vercel builds it and previews pull requests from branches in this repo. Fork pull requests are
previewed by
[.github/workflows/preview-deploy.yml](../../.github/workflows/preview-deploy.yml), gated by the
`preview-deploy-approval` environment.

## More

- [Architecture](../../docs/architecture.md): how `@status-im/wallet` feeds this app.
