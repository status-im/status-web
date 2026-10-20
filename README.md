# status-web

[![CI](https://github.com/status-im/status-web/actions/workflows/ci.yml/badge.svg)](https://github.com/status-im/status-web/actions/workflows/ci.yml)

Monorepo for the Status ecosystem: websites, web apps, dapps, browser extensions, shared libraries and the Status API.

## Packages

| Name                                                               | Storybook                                                                                                            | Builds                                                                                                                              | Description                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`@status-im/colors`](./packages/colors)                           | [![vercel](https://img.shields.io/badge/vercel-black)](https://status-components.vercel.app/?path=/story/colors)     | [![npm version](https://img.shields.io/npm/v/@status-im/colors.svg)](https://www.npmjs.com/package/@status-im/colors)               | Design tokens: color palette generated from the design system.                   |
| [`@status-im/icons`](./packages/icons)                             | [![vercel](https://img.shields.io/badge/vercel-black)](https://status-components.vercel.app/?path=/story/icons)      | [![npm version](https://img.shields.io/npm/v/@status-im/icons.svg)](https://www.npmjs.com/package/@status-im/icons)                 | Design tokens: icon set generated from the design system.                        |
| [`@status-im/components`](./packages/components)                   | [![vercel](https://img.shields.io/badge/vercel-black)](https://status-components.vercel.app/?path=/story/components) | [![npm version](https://img.shields.io/npm/v/@status-im/components.svg)](https://www.npmjs.com/package/@status-im/components)       | UI component library built on Radix UI, React Aria and Tailwind CSS.             |
| [`@status-im/js`](./packages/status-js)                            |                                                                                                                      | [![npm version](https://img.shields.io/npm/v/@status-im/js.svg)](https://www.npmjs.com/package/@status-im/js)                       | Status JS SDK, used by status.app, get.status.app and community-dapp.            |
| [`@status-im/wallet`](./packages/wallet)                           |                                                                                                                      |                                                                                                                                     | Shared wallet UI, hooks and tRPC data layer (private).                           |
| [`@status-im/status-network`](./packages/status-network)           |                                                                                                                      |                                                                                                                                     | Shared code for status.network and hub (private).                                |
| [`@status-im/ethereum-provider`](./packages/ethereum-provider)     |                                                                                                                      |                                                                                                                                     | EIP-1193 provider shared by wallet and connector (public, not published to npm). |
| [`@status-im/eslint-config`](./packages/eslint-config)             |                                                                                                                      | [![npm version](https://img.shields.io/npm/v/@status-im/eslint-config.svg)](https://www.npmjs.com/package/@status-im/eslint-config) | Shared ESLint configuration.                                                     |
| [`@status-im/sitemap-utils`](./packages/sitemap-utils)             |                                                                                                                      |                                                                                                                                     | Sitemap helpers for the static exports (private).                                |
| [`@status-im/community-contracts`](./packages/community-contracts) |                                                                                                                      |                                                                                                                                     | Solidity contracts for the community dapp, built with Foundry (private).         |

## Apps

| Name                                           | Deployments                                                                                                                                | Builds                                                                                                                   | Description                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [`apps/status.app`](./apps/status.app)         | [![vercel](https://img.shields.io/badge/vercel-black)](https://status.app)                                                                 |                                                                                                                          | Main Status website: help centre, specs, blog and admin. Port 3001. |
| [`apps/get.status.app`](./apps/get.status.app) | [![vercel](https://img.shields.io/badge/vercel-black)](https://get.status.app)                                                             |                                                                                                                          | Download-focused subset of status.app. Port 3005.                   |
| [`apps/status.network`](./apps/status.network) | [![vercel](https://img.shields.io/badge/vercel-black)](https://status.network)                                                             |                                                                                                                          | Status Network website. Port 3002.                                  |
| [`apps/hub`](./apps/hub)                       | [![vercel](https://img.shields.io/badge/vercel-black)](https://hub.status.network)                                                         |                                                                                                                          | Status Network Hub dapp. Port 3003.                                 |
| [`apps/connector`](./apps/connector)           | [![chrome web store](https://img.shields.io/badge/chrome-grey)](https://chromewebstore.google.com/detail/kahehnbpamjplefhpkhafinaodkkenpg) | [![jenkins job](https://img.shields.io/badge/jenkins-grey)](https://ci.status.im/job/status-web/job/main/job/connector/) | Browser extension connecting dapps to Status Desktop (Plasmo).      |
| [`apps/portfolio`](./apps/portfolio)           |                                                                                                                                            |                                                                                                                          | Portfolio tracker dapp. Port 3004.                                  |
| [`apps/wallet`](./apps/wallet)                 | [![chrome web store](https://img.shields.io/badge/chrome-grey)](https://chromewebstore.google.com/detail/opkfeajbclhjdneghppfnfiannideafj) | [![jenkins job](https://img.shields.io/badge/jenkins-grey)](https://ci.status.im/job/status-web/job/main/job/wallet/)    | Crypto wallet browser extension (WXT). Port 4000.                   |
| [`apps/api`](./apps/api)                       |                                                                                                                                            |                                                                                                                          | Status API: tRPC backend serving the wallet data layer. Port 3030.  |
| [`apps/community-dapp`](./apps/community-dapp) |                                                                                                                                            |                                                                                                                          | Community directory curator dapp.                                   |

## Other workspaces

| Name           | Description                                         |
| -------------- | --------------------------------------------------- |
| [`e2e`](./e2e) | Playwright end-to-end tests for the Hub and wallet. |

## Requirements

- [Node.js](https://nodejs.org/) 22 (see `.node-version`)
- [pnpm](https://pnpm.io) 9.12.3 (see `packageManager` in `package.json`)
- Optional: [Nix](https://nixos.org/download.html) for `nix develop`

## Stack

Next.js 15 apps, WXT (wallet extension), Plasmo (connector extension), tRPC, Drizzle ORM, Contentlayer, Tailwind CSS, Vite for packages, Storybook for components, Turborepo, TypeScript, pnpm.

## Getting Started

```bash
git clone https://github.com/status-im/status-web.git
cd status-web
git submodule update --init --recursive   # specs, legal and Foundry submodules
pnpm install
pnpm build
pnpm test
pnpm dev
```

Optional: run `nix develop` before `pnpm install` to enter the Nix shell.

## Contributing

- Pull requests target the `develop` branch.
- Read [AGENTS.md](AGENTS.md) for repo rules and the docs layout.
- Fork the repo, create a branch, and open a PR against `status-im/status-web`.

## Storybook

```bash
pnpm storybook
```

## Sponsors

This project is sponsored by Browserstack.

## Docs

- [AGENTS.md](AGENTS.md): rules for agents.
- [docs/README.md](docs/README.md): index of cross-cutting docs.
- [docs/architecture.md](docs/architecture.md): apps vs packages and content pipelines.
- [docs/deployment.md](docs/deployment.md): CI, Vercel, extension releases and npm packages.
- [e2e/README.md](e2e/README.md): how to run the end-to-end tests.
