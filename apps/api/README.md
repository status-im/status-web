# api

The hosted tRPC API for Status web apps, served at
[https://status-api-status-im-web.vercel.app](https://status-api-status-im-web.vercel.app). It is a
thin Next.js App Router handler that exposes the `apiRouter` from
[`@status-im/wallet/data`](../../packages/wallet/src/data/api/index.ts) over HTTP, plus a JSON-RPC
proxy. No UI, no root page.

## Run

```bash
pnpm --filter api dev        # http://localhost:3030
pnpm --filter api build
pnpm --filter api test       # vitest
pnpm --filter api typecheck  # tsc
```

## Environment

Pull the Vercel env set into `.env.local`:

```bash
vercel env pull .env.local
```

`env:check` validates `.env` against `src/config/env.server.mjs`. The required vars (Infura,
MercuryO, Alchemy, CoinGecko, and the ETH and market RPC proxy credentials) are listed there.

## Endpoints

- `GET /api/trpc/<query>`: tRPC queries (`activities`, `assets`, `collectibles`, `config`,
  `market`, and the `nodes` read procedures) from `apiRouter`. POST is accepted for queries too.
- `POST /api/trpc/<mutation>`: tRPC mutations (`nodes.broadcastTransaction`, `rpc.proxy`).
- `POST /api/trpc/rpc.proxy?chainId=<id>`: JSON-RPC proxy that translates a JSON-RPC body to tRPC
  and back, for wallet and hub read traffic.

All routes send permissive CORS headers; `vercel.json` caps `app/api/**/*` at `maxDuration` 800.

## Consumers

- `apps/wallet` (browser extension): `WXT_STATUS_API_URL`.
- `apps/hub`: `NEXT_PUBLIC_STATUS_API_URL` (default `http://localhost:3030`) for
  `market.tokenPrice` and the RPC proxy.
- `apps/portfolio`: runs the same router in-process via `createAPI` from `@status-im/wallet/data`
  rather than over HTTP.

## Deploy

Deployed on Vercel as the `status-im-web/status-api` project.

## More

- [Agent guide](AGENTS.md)
