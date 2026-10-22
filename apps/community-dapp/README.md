# @status-im/community-dapp

Community directory curator dapp for Status: SNT holders vote on which communities get listed in the Status app. A webpack and React 17 app, not Next.js. [`src`](src) reads the contracts in [`@status-im/community-contracts`](../../packages/community-contracts) and community data over Waku.

## Run

    pnpm --filter @status-im/community-dapp dev    # http://localhost:8080

`predev` builds the contracts first, and `dev` regenerates the Waku protobufs before webpack starts. Running it locally also needs an Anvil chain with deployed contracts; [docs/local-development.md](docs/local-development.md) has the walkthrough.

## Build

    ENV=preview INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build        # Optimism Sepolia
    ENV=production INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp build     # Optimism Mainnet

Output goes to `dist/`.

## Environment

Copy `.env.example` to `.env` and export it before running (`set -a && source .env && set +a`):

- `ENV`: `development` (the default), `preview` or `production`. Webpack throws on anything else.
- `INFURA_API_KEY`: required in every environment, for Waku community data and the Optimism RPC.
- `VOTING_CONTRACT`, `DIRECTORY_CONTRACT`, `TOKEN_CONTRACT`, `MULTICALL_CONTRACT`, `FEATURED_VOTING_CONTRACT`: development only, filled with the addresses from a local forge deploy.

The preview and production contract addresses are in `src/config.ts`.

## Deploy

Hosted on Vercel, configured in `vercel.json`. Preview builds target Optimism Sepolia, production builds target Optimism Mainnet. Vercel runs `scripts/vercel-build.sh`, which installs forge, builds the contract ABIs and then runs webpack.

## More

- [Local development](docs/local-development.md): Anvil, contract deployment and MetaMask.
- [Agent guide](AGENTS.md): commands, rules and caveats for coding agents.
- [Contracts](../../packages/community-contracts/README.md) and their [properties](../../packages/community-contracts/docs/properties.md).
