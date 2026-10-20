# Portfolio

The Status portfolio web app: view and manage Ethereum assets and collectibles across multiple addresses and networks. A [Next.js](https://nextjs.org/) app on port 3004 that builds on `@status-im/wallet` for data and components.

## Run

    pnpm --filter portfolio dev    # http://localhost:3004

Run from the repo root. `dev` uses Turbopack.

## Build

    pnpm --filter portfolio build   # production build
    pnpm --filter portfolio start   # next start

## Environment

Committed defaults live in `.env`. Pull secrets locally:

    vercel env pull .env.local

Server and client variables are validated at build time by `src/config/env.server.mjs` and `src/config/env.client.mjs` (Infura, Alchemy, CoinGecko, Mercuryo and RPC proxy credentials).

## Deploy

Deployed on Vercel. Pull request previews come from [.github/workflows/preview-deploy.yml](../../.github/workflows/preview-deploy.yml).

## More

- [Architecture](../../docs/architecture.md): how `@status-im/wallet` feeds this app.
