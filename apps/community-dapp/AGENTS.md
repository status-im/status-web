# apps/community-dapp

Rules for agents working in `apps/community-dapp`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The community directory curator dapp: SNT holders vote on which communities get listed in Status. A webpack and React 17 app, not Next.js, on dev port 8080, built from [`src`](src). It reads the contracts directly and has no subgraph.

## Commands

    pnpm --filter @status-im/community-dapp dev       # webpack dev server, http://localhost:8080
    ENV=preview INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build
    ENV=production INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build
    pnpm --filter @status-im/community-dapp lint

`predev` and `prebuild` build `@status-im/community-contracts` first; `dev` and `build` then run `generate:proto` for the Waku messages.

## Rules

- This app is pinned to React 17 by the root `pnpm.overrides` entry (`@status-im/community-dapp>react`), while the rest of the repo is on React 19. Do not use React 19 APIs here, and do not import React 19-only packages such as `@status-im/components`.
- `dev` and `build` run webpack with `NODE_OPTIONS=--openssl-legacy-provider`. Keep that flag; the legacy crypto dependencies need it.
- `ENV` must be `development`, `preview` or `production`; the webpack config throws on anything else. `preview` targets Optimism Sepolia and `production` targets Optimism Mainnet.
- Contract addresses for preview and production live in `src/config.ts`. Development addresses come from env vars set after a local forge deploy, see [docs/local-development.md](docs/local-development.md).
- The `test` script is disabled on purpose because of a `@waku/utils` libp2p dependency clash. Do not re-enable it without fixing that first.

## Caveats

- Community data comes over Waku through `RequestClient` from `@status-im/js`, which needs `INFURA_API_KEY` in every environment, development included.
- There is no subgraph. `packages/community-subgraph` is a dead scaffold that is not part of this app or the workspace.

## Docs

- [Local development](docs/local-development.md): Anvil, contract deployment and the MetaMask setup.
- [Contracts](../../packages/community-contracts/README.md): addresses and Foundry commands.
