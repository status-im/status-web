# AGENTS.md

Rules for agents working in `apps/community-dapp`. The root [AGENTS.md](../../AGENTS.md) also applies.

## Role

The community directory curator dApp: SNT holders vote on which communities are listed in Status. A webpack and React 17 app (not Next.js) on dev port 8080, reading contracts directly. It does not use a subgraph.

## Commands

    pnpm --filter @status-im/community-dapp dev       # webpack dev server, http://localhost:8080
    ENV=preview INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build
    ENV=production INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build
    pnpm --filter @status-im/community-dapp lint

`predev` and `prebuild` build `@status-im/community-contracts` first; `dev` and `build` regenerate the Waku protobufs (`generate:proto`).

## Rules

- This app is pinned to React 17 via the root `pnpm.overrides` (`@status-im/community-dapp>react`), while the rest of the repo is React 19. Do not use React 19 APIs here and do not import React 19-only packages such as `@status-im/components`.
- `dev` and `build` run webpack with `NODE_OPTIONS=--openssl-legacy-provider`. Keep that flag in the scripts; it is required by the legacy crypto dependencies.
- `ENV` must be one of `development`, `preview` or `production`; the webpack config throws otherwise. `preview` targets Optimism Sepolia, `production` targets Optimism Mainnet.
- Contract addresses live in `src/config.ts` for preview and production. Development addresses come from env vars set after a local forge deploy (see `docs/local-development.md`).
- The `test` script is intentionally disabled (a `@waku/utils` libp2p dependency clash). Do not re-enable it without resolving that.

## Caveats

- Community data is fetched over Waku via `@status-im/js` `RequestClient`, which needs `INFURA_API_KEY` in every environment, including development.
- There is no subgraph. `packages/community-subgraph` is a dead scaffold and is not part of this app or the workspace.

## Docs

- [Local development](docs/local-development.md): the Anvil and MetaMask walkthrough.
- [Contracts](../../packages/community-contracts/README.md): deployment addresses and Foundry commands.
