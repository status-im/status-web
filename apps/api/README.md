# api

The hosted tRPC API for the Status web apps, at
[https://status-api-status-im-web.vercel.app](https://status-api-status-im-web.vercel.app). It is a
thin Next.js App Router handler that serves the `apiRouter` from
[`@status-im/wallet/data`](../../packages/wallet/src/data/api/index.ts) over HTTP, and answers plain
JSON-RPC by routing it through the same router. No UI, no root page.

## Run

```bash
pnpm --filter api dev        # http://localhost:3030
pnpm --filter api build
pnpm --filter api test       # vitest
pnpm --filter api typecheck  # tsc
```

## Environment

`.env` is committed with empty defaults. Pull the deployed set into `.env.local`, which is
gitignored:

```bash
vercel env pull .env.local
```

`src/config/env.server.mjs` has the full list and is imported by `next.config.mjs`, so a missing
variable fails the build rather than a request. The app needs Infura, MercuryO, Alchemy and
CoinGecko keys plus credentials for the ETH and market RPC proxies. `pnpm --filter api env:check`
runs the same schema against `.env` without a build.

## Endpoints

`GET /api/trpc/<query>` answers queries from `apiRouter`: `activities`, `assets`, `collectibles`,
`config`, `market`, and the read procedures on `nodes`. `POST` works for queries too.

`POST /api/trpc/<mutation>` covers the mutations: `nodes.broadcastTransaction` and `rpc.proxy`.

`POST /api/trpc/rpc.proxy?chainId=<id>` takes a plain JSON-RPC body, runs it through the tRPC
mutation and returns JSON-RPC. The wallet and hub use it for chain reads.

CORS is open on purpose, since everything here is public read traffic. Queries are cached for an
hour unless the procedure is on the no-store list in
[`route.ts`](src/app/api/trpc/%5Btrpc%5D/route.ts); `vercel.json` caps `app/api/**/*` at
`maxDuration` 800 seconds.

## Who calls it

`apps/wallet` points `WXT_STATUS_API_URL` here. `apps/hub` uses `NEXT_PUBLIC_STATUS_API_URL`, which
defaults to `http://localhost:3030` locally, for `market.tokenPrice` and the RPC proxy.
`apps/portfolio` does not go over HTTP at all: it runs the same router in-process with `createAPI`.

## Deploy

Vercel, project `status-im-web/status-api`. Preview deployments for pull requests from forks come
from `.github/workflows/preview-deploy.yml`.

## More

- [Agent guide](AGENTS.md)
