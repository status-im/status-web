# Architecture

How the status-web monorepo splits into [`apps/`](../apps) and [`packages/`](../packages), which app uses which package, and how content reaches the published sites.

## Apps and packages

The nine apps are the deployed products: six Next.js apps, the `community-dapp` webpack app, and the `wallet` and `connector` browser extensions. Each starts a dev server on its own port, through its `dev`, `dev:next` or `dev:content` script; the root [AGENTS.md](../AGENTS.md) table lists them.

The packages are libraries. `colors`, `icons`, `components`, `js`, `eslint-config` and `ethereum-provider` are public on npm; `wallet`, `status-network`, `sitemap-utils` and `community-contracts` are private. Turborepo builds a package before the apps that depend on it (`"dependsOn": ["^build"]` in [`turbo.json`](../turbo.json)), so `pnpm build` resolves a fresh `dist/`. Starting `next dev` right after editing a package is the usual way to run an app against a stale build.

`e2e` is a Playwright workspace and ships nothing.

## Who uses which package

Taken from the `dependencies` block of each workspace's `package.json`:

- `@status-im/components`: status.app, status.network, hub, portfolio, wallet, get.status.app.
- `@status-im/colors`: status.app, status.network, hub, portfolio, wallet, get.status.app, connector.
- `@status-im/icons`: status.app, status.network, hub, portfolio, wallet, get.status.app.
- `@status-im/js`: status.app, get.status.app, community-dapp.
- `@status-im/wallet`: apps/api (the data router), wallet, portfolio, hub.
- `@status-im/status-network`: status.network, hub.
- `@status-im/ethereum-provider`: wallet, connector.
- `@status-im/sitemap-utils`: hub, status.network, get.status.app.
- `@status-im/community-contracts`: community-dapp.

`@status-im/eslint-config` is used by the packages and by most apps. `apps/api` and `apps/status.network` use only `eslint-config-next`, `apps/community-dapp` has its own `eslint.config.mjs`, and `community-contracts`, `ethereum-provider` and `sitemap-utils` declare no ESLint config.

## Status API and tRPC

[`apps/api`](../apps/api) is a Next.js App Router app with no UI. One route handler, [`route.ts`](../apps/api/src/app/api/trpc/[trpc]/route.ts), serves the `apiRouter` from [`@status-im/wallet/data`](../packages/wallet/src/data) at `/api/trpc`, and also answers plain JSON-RPC on `rpc.proxy` by converting it to tRPC and back. Consumers:

- `apps/hub` sends `NEXT_PUBLIC_STATUS_API_URL` traffic here for exchange rates and the RPC proxy.
- `apps/wallet` points `WXT_STATUS_API_URL` here for assets, collectibles, activities and RPC.
- `apps/portfolio` calls the same router in-process through `createAPI` instead of over HTTP ([`src/data/api.ts`](../apps/portfolio/src/data/api.ts)).
- `apps/status.app` runs its own tRPC v11 server for the admin insights and reporting area under [`src/server`](../apps/status.app/src/server).

## Content pipelines

hub, status.network and get.status.app export statically in production (`output: 'export'` behind a `NODE_ENV` check in each `next.config`). Their `postbuild` runs `next-sitemap`, then each app's own `scripts/strip-default-locale-prefix.sh`, which moves the default locale out of `/en` to the root and copies each page to `page/index.html`. next-intl needs explicit locale prefixes for a static export, and simple file servers do not map `/page` to `page.html`, so both rewrites happen after the build. status.app and portfolio need a Node server and do neither.

- status.app turns `content/help`, `content/legal` and the `content/specs` submodule into MDX at build time through [Contentlayer](../apps/status.app/contentlayer.config.ts) and `next-contentlayer2`. Admin insights use GraphQL codegen against Hasura, and reporting data lives in Postgres through [Drizzle](../apps/status.app/drizzle.config.ts).
- status.network takes its blog from Ghost through the client in [`src/app/_lib`](../apps/status.network/src/app/_lib), and the `content/legal-external` submodule supplies the legal pages.
- get.status.app is the download-focused subset of status.app, and also ships `llms.txt`.
- community-dapp reads the deployed contracts through the ABIs exported from `@status-im/community-contracts/abi` and exchanges community data over Waku.

### Submodules

- `apps/status.app/content/specs` (status-im/status-specs)
- `apps/status.network/content/legal-external`
- `packages/community-contracts/lib/*` (forge-std, minime, openzeppelin-contracts)

## Extensions

wallet is a WXT extension, built with `wxt build -b chrome` or `-b firefox` and wrapped by `pnpm --filter wallet build:chrome` and `build:firefox`. See [`apps/wallet`](../apps/wallet).

connector is a Plasmo extension that connects dapps to Status Desktop, built with `plasmo build` and wrapped by `pnpm --filter connector build:chrome` and `build:firefox`. See [`apps/connector`](../apps/connector).
