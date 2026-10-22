# status-web

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

Everything Status runs on the web lives in this monorepo: the status.app and Status Network
websites, the hub, portfolio and community dapps, the wallet and connector browser extensions, the
API the wallet reads from, plus the design tokens and components they share. It is one pnpm
workspace with Turborepo driving the builds.

## Apps

| App                                            | What it is                                                                        | Port |
| ---------------------------------------------- | --------------------------------------------------------------------------------- | ---- |
| [`apps/status.app`](./apps/status.app)         | Marketing site, help centre, specs hub, blog and the admin screens behind them.   | 3001 |
| [`apps/get.status.app`](./apps/get.status.app) | The download pages, cut out of status.app so they stay small.                     | 3005 |
| [`apps/status.network`](./apps/status.network) | Status Network website; the blog comes from Ghost.                                | 3002 |
| [`apps/hub`](./apps/hub)                       | Status Network Hub dapp.                                                          | 3003 |
| [`apps/portfolio`](./apps/portfolio)           | Portfolio tracker for assets and collectibles across addresses and networks.      | 3004 |
| [`apps/community-dapp`](./apps/community-dapp) | Curator dapp for Status communities, reading the contracts and sharing over Waku. | 8080 |
| [`apps/wallet`](./apps/wallet)                 | Wallet extension built with WXT.                                                  | 4000 |
| [`apps/connector`](./apps/connector)           | Extension that hands Status Desktop's wallet to dapps, built with Plasmo.         | -    |
| [`apps/api`](./apps/api)                       | tRPC API for the wallet data layer, plus a JSON-RPC proxy.                        | 3030 |

Four sites are live on their own domains: [status.app](https://status.app),
[get.status.app](https://get.status.app), [status.network](https://status.network) and
[hub.status.network](https://hub.status.network). The extensions are in the Chrome Web Store
([wallet](https://chromewebstore.google.com/detail/opkfeajbclhjdneghppfnfiannideafj),
[connector](https://chromewebstore.google.com/detail/kahehnbpamjplefhpkhafinaodkkenpg)) and are built
by the [wallet](https://ci.status.im/job/status-web/job/main/job/wallet/) and
[connector](https://ci.status.im/job/status-web/job/main/job/connector/) Jenkins jobs.

## Packages

| Package                                                            | What it is                                                            | Ships as                                                                                                                              |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`@status-im/colors`](./packages/colors)                           | Color tokens generated from the design system.                        | [npm](https://www.npmjs.com/package/@status-im/colors), [Storybook](https://status-components.vercel.app/?path=/story/colors)         |
| [`@status-im/icons`](./packages/icons)                             | Icon set generated from the design system.                            | [npm](https://www.npmjs.com/package/@status-im/icons), [Storybook](https://status-components.vercel.app/?path=/story/icons)           |
| [`@status-im/components`](./packages/components)                   | UI components on Radix UI, React Aria and Tailwind CSS.               | [npm](https://www.npmjs.com/package/@status-im/components), [Storybook](https://status-components.vercel.app/?path=/story/components) |
| [`@status-im/js`](./packages/status-js)                            | Status JS SDK, used by status.app, get.status.app and community-dapp. | [npm](https://www.npmjs.com/package/@status-im/js)                                                                                    |
| [`@status-im/eslint-config`](./packages/eslint-config)             | Shared ESLint configuration.                                          | [npm](https://www.npmjs.com/package/@status-im/eslint-config)                                                                         |
| [`@status-im/wallet`](./packages/wallet)                           | Wallet UI, hooks and the tRPC data layer.                             | Private                                                                                                                               |
| [`@status-im/status-network`](./packages/status-network)           | Code shared by status.network and hub.                                | Private                                                                                                                               |
| [`@status-im/ethereum-provider`](./packages/ethereum-provider)     | EIP-1193 provider shared by the wallet and connector.                 | Never published                                                                                                                       |
| [`@status-im/sitemap-utils`](./packages/sitemap-utils)             | Sitemap helpers for the static exports.                               | Private                                                                                                                               |
| [`@status-im/community-contracts`](./packages/community-contracts) | Solidity contracts for community-dapp, built with Foundry.            | Private                                                                                                                               |

[`e2e`](./e2e) holds the Playwright tests for the hub and the wallet extension.

The sites and dapps are Next.js 15 and Tailwind CSS, apart from community-dapp, which webpacks a
styled-components app. The wallet is WXT, the connector is Plasmo, the API is tRPC. status.app
builds its pages from `content/` through Contentlayer and keeps reporting data in Postgres with
Drizzle. The packages build with Vite and the components have a Storybook.

## Getting started

You need Node.js 22 (`.node-version` pins 22.17.0) and pnpm 9.12.3 (`packageManager` in
`package.json`). [Nix](https://nixos.org/download.html) is optional: `nix develop` gives you the
dev shell with Node 22, pnpm, Foundry and ghp-import.

```bash
git clone https://github.com/status-im/status-web.git
cd status-web
git submodule update --init --recursive
pnpm install
pnpm build
pnpm test
pnpm dev
```

The submodules are load-bearing: status.app will not build without `content/specs`, status.network
needs `content/legal-external` for its legal pages, and `packages/community-contracts` needs the
Foundry libraries in `lib/`.

`pnpm dev` installs first, then runs every app and `@status-im/*` package in watch mode. Filter it
when you only care about one app, for example `pnpm --filter hub dev`. `pnpm storybook` opens the
components.

Every app reads its own env file. Where the app has a `.env.example`, copy it and fill in the
values; the app's README lists what is required and where to get it.

## Deploying

Jenkins builds the two extensions, the static exports of hub, status.network and get.status.app,
and the status.app Docker image. Vercel builds status.app, portfolio, api and community-dapp, and
previews pull requests. Nothing is published to npm at the moment, so version bumps stay in the
repo. [docs/deployment.md](docs/deployment.md) has the branches, jobs and credentials.

## Contributing

Branch off `develop` and open the pull request against `develop` on `status-im/status-web`. CI runs
`pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format --check` and `pnpm test`, so run those
before you push. [AGENTS.md](AGENTS.md) holds the repo rules, including where docs go.

This project is sponsored by Browserstack.

## More docs

- [docs/README.md](docs/README.md): index of the docs that span several apps or packages.
- [docs/architecture.md](docs/architecture.md): which app uses which package, and how content reaches each site.
- [docs/deployment.md](docs/deployment.md): Jenkins, Vercel, extension releases and npm.
- [e2e/README.md](e2e/README.md): running the end-to-end tests.
- Every app and package README: run and deploy steps for that workspace.
