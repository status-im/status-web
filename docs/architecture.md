# Architecture

How the status-web monorepo is split across [`apps/`](../apps) and [`packages/`](../packages), who consumes each package, and how content flows into the published sites.

## Apps vs packages

- `apps/*` are deployable products: Next.js websites and dapps, two browser extensions, and the Status API. Each has its own `package.json` and `dev` port (see the root [AGENTS.md](../AGENTS.md) table).
- `packages/*` are shared libraries, published to npm or kept private. Public ones carry an npm badge in the root [README.md](../README.md); `wallet`, `status-network`, `sitemap-utils` and `community-contracts` are private.
- `e2e` is a Playwright workspace, not shipped.

## Package consumers

Mapped from each workspace's `package.json` dependencies:

- `@status-im/components`: status.app, status.network, hub, portfolio, wallet, get.status.app.
- `@status-im/colors`: status.app, status.network, hub, portfolio, wallet, get.status.app, connector.
- `@status-im/icons`: status.app, status.network, hub, portfolio, wallet, get.status.app.
- `@status-im/js`: status.app, get.status.app, community-dapp.
- `@status-im/wallet`: apps/api (the data router), wallet, portfolio, hub.
- `@status-im/status-network`: status.network, hub.
- `@status-im/ethereum-provider`: wallet, connector.
- `@status-im/community-contracts`: community-dapp.
- `@status-im/eslint-config`: most apps and packages. `apps/api` and `apps/status.network` use `eslint-config-next`; `apps/community-dapp` has its own config; `community-contracts`, `ethereum-provider` and `sitemap-utils` declare none.

## Status API and tRPC

[`apps/api`](../apps/api) is a thin Next.js app. Its [`route.ts`](../apps/api/src/app/api/trpc/[trpc]/route.ts) exposes the `apiRouter` from [`@status-im/wallet/data`](../packages/wallet/src/data) over tRPC at `/api/trpc`, including a JSON-RPC to tRPC shim for `rpc.proxy`. Consumers:

- `apps/hub` points `NEXT_PUBLIC_STATUS_API_URL` at it for exchange rates and the RPC proxy.
- `apps/wallet` points `WXT_STATUS_API_URL` at it for assets, collectibles, activities and RPC.
- `apps/status.app` runs its own separate tRPC server (v11) for the admin insights and reporting area under [`src/server`](../apps/status.app/src/server).

## Content pipelines

- **status.app**: [Contentlayer](../apps/status.app/contentlayer.config.ts) turns `content/help`, `content/legal` and the `content/specs` submodule into MDX at build time, wired in via `next-contentlayer2`. Admin insights use GraphQL codegen against Hasura, and reporting data lives in Postgres via [Drizzle](../apps/status.app/drizzle.config.ts).
- **status.network**: static export plus a Ghost blog client under [`src/app/_lib`](../apps/status.network/src/app/_lib); the `content/legal-external` submodule supplies legal pages.
- **get.status.app**: static export of the download-focused subset.
- **community-dapp**: reads contracts directly and does not use the dead `packages/community-subgraph` scaffold.

### Submodules

- `apps/status.app/content/specs` (status-im/status-specs)
- `apps/status.network/content/legal-external`
- `packages/community-contracts/lib/*` (forge-std, minime, openzeppelin-contracts)

## Extensions

- **wallet** is a WXT extension built with `wxt build -b chrome|firefox` (see [`apps/wallet`](../apps/wallet)).
- **connector** is a Plasmo extension connecting dapps to Status Desktop, built with `plasmo build` (see [`apps/connector`](../apps/connector)).
