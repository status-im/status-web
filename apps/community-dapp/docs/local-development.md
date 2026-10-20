# Local development

How to run [../README.md](../README.md) against a local Anvil chain, with the contracts from [`packages/community-contracts`](../../../packages/community-contracts).

## Prerequisites

- Node.js 22.17.0 or newer and pnpm 9
- Foundry (`forge` and `anvil`): `curl -L https://foundry.paradigm.xyz | bash && foundryup`

## 1. Install dependencies

From the monorepo root:

```bash
pnpm install
```

Initialize the forge submodules (once):

```bash
git submodule update --init --recursive packages/community-contracts/lib
```

## 2. Start Anvil

In a dedicated terminal:

```bash
anvil
```

Anvil starts at `http://127.0.0.1:8545` with chain ID 31337. Copy one of the printed private keys; you will import it into MetaMask.

The deploy script mints 100,000,000 tokens to Anvil account #0 (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`). The dapp needs at least 10,000 to start a vote, so either import account #0 into MetaMask or transfer tokens to your wallet:

```bash
cast send <TOKEN_CONTRACT> \
  "transfer(address,uint256)" \
  <YOUR_WALLET_ADDRESS> \
  50000000000000000000000 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://127.0.0.1:8545
```

`50000000000000000000000` is 50,000 tokens (18 decimals).

## 3. Deploy the contracts

In another terminal, from the monorepo root:

```bash
cd packages/community-contracts
forge script script/DeployContracts.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

The script broadcasts from Anvil account #0 by default (see `script/Base.s.sol` for the `ETH_FROM` and `MNEMONIC` overrides). On a local Anvil chain it deploys a MiniMeToken, Multicall2, the Directory, the VotingContract and the FeaturedVotingContract. The output maps to env variables as follows:

| forge output label       | env variable               |
| ------------------------ | -------------------------- |
| `MiniMeToken`            | `TOKEN_CONTRACT`           |
| `Directory`              | `DIRECTORY_CONTRACT`       |
| `VotingContract`         | `VOTING_CONTRACT`          |
| `FeaturedVotingContract` | `FEATURED_VOTING_CONTRACT` |
| `Multicall2`             | `MULTICALL_CONTRACT`       |

Addresses change on every fresh Anvil run, so use the addresses from your output.

## 4. Configure MetaMask

1. Add a custom network:
   - Network name: Anvil Localhost
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency symbol: ETH
2. Import an Anvil account with one of the private keys printed by `anvil` (account #1 is `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`).
3. Switch MetaMask to the Anvil Localhost network before connecting.

## 5. Start the dev server

Fill in the addresses from step 3:

```bash
INFURA_API_KEY=<your_infura_key> \
VOTING_CONTRACT=<voting address> \
DIRECTORY_CONTRACT=<directory address> \
TOKEN_CONTRACT=<token address> \
MULTICALL_CONTRACT=<multicall address> \
FEATURED_VOTING_CONTRACT=<featured voting address> \
pnpm --filter @status-im/community-dapp run dev
```

`INFURA_API_KEY` is required even in development; `RequestClient` uses it to fetch community details from the Status/Waku network. A key can often be found in `apps/status.app/.env.local`. Open <http://localhost:8080>.
