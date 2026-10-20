# @status-im/community-dapp

Community directory curator dApp for Status: SNT holders vote on which communities are listed in the Status app. A webpack and React 17 app (not Next.js), reading the contracts from `@status-im/community-contracts` and community data over Waku.

## Run

    pnpm --filter @status-im/community-dapp dev    # http://localhost:8080

`predev` builds the contracts first and `dev` regenerates the Waku protobufs before starting webpack. Local development needs an Anvil chain and deployed contracts; see [docs/local-development.md](docs/local-development.md).

## Build

    ENV=preview INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build        # Optimism Sepolia
    ENV=production INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build     # Optimism Mainnet

Output goes to `dist/`.

## Environment

Copy `.env.example` to `.env` and export it before running (`set -a && source .env && set +a`):

- `ENV`: `development` (default), `preview` or `production`
- `INFURA_API_KEY`: required in every environment (Waku community data and Optimism RPC)
- `VOTING_CONTRACT`, `DIRECTORY_CONTRACT`, `TOKEN_CONTRACT`, `MULTICALL_CONTRACT`, `FEATURED_VOTING_CONTRACT`: development only, the addresses from the forge deploy

Preview and production contract addresses live in `src/config.ts`.

## Deploy

Deployed on Vercel (see `vercel.json`). Preview builds target Optimism Sepolia, production builds target Optimism Mainnet.

## More

- [Local development](docs/local-development.md): the full Anvil walkthrough
- [Agent guide](AGENTS.md)
- [Contracts](../../packages/community-contracts/README.md) and their [properties](../../packages/community-contracts/docs/properties.md)
