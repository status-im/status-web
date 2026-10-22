# Local development

How to run [@status-im/community-dapp](../README.md) against a local Anvil chain, using the contracts in [`packages/community-contracts`](../../../packages/community-contracts).

## Before you start

You need Node.js 22.17.0 or newer, pnpm 9, and Foundry (`forge` and `anvil`). If Foundry is missing:

    curl -L https://foundry.paradigm.xyz | bash && foundryup

## 1. Install dependencies

From the monorepo root:

```bash
pnpm install
```

Initialize the forge submodules once:

```bash
git submodule update --init --recursive packages/community-contracts/lib
```

## 2. Start Anvil

In a dedicated terminal:

```bash
anvil
```

Anvil listens on `http://127.0.0.1:8545` with chain ID 31337 and prints a set of accounts and private keys. Keep this terminal open.

The contracts you deploy in the next step put 100,000,000 tokens on Anvil account #0 (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`). A vote needs 10,000 SNT, so either import account #0 into MetaMask or move tokens to your own wallet (the command is in step 3, once you have a token address).

## 3. Deploy the contracts

In another terminal, from the monorepo root:

```bash
cd packages/community-contracts
forge script script/DeployContracts.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

The script broadcasts from Anvil account #0 unless you set `ETH_FROM` or `MNEMONIC` (see `script/Base.s.sol`). On a local chain it deploys a MiniMeToken, Multicall2, the Directory, the VotingContract and the FeaturedVotingContract. The addresses change on every fresh Anvil run, so use the ones from your own output. They map to env vars like this:

| forge output label       | env variable               |
| ------------------------ | -------------------------- |
| `MiniMeToken`            | `TOKEN_CONTRACT`           |
| `Directory`              | `DIRECTORY_CONTRACT`       |
| `VotingContract`         | `VOTING_CONTRACT`          |
| `FeaturedVotingContract` | `FEATURED_VOTING_CONTRACT` |
| `Multicall2`             | `MULTICALL_CONTRACT`       |

To move tokens to another wallet instead of importing account #0:

```bash
cast send <TOKEN_CONTRACT> \
  "transfer(address,uint256)" \
  <YOUR_WALLET_ADDRESS> \
  50000000000000000000000 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://127.0.0.1:8545
```

That private key is Anvil account #0 and `50000000000000000000000` is 50,000 tokens at 18 decimals.

## 4. Point MetaMask at Anvil

1. Add a custom network: name `Anvil Localhost`, RPC URL `http://127.0.0.1:8545`, chain ID `31337`, currency symbol ETH.
2. Import an Anvil account: account #1 is `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`, or use any of the keys `anvil` prints.
3. Switch to the Anvil Localhost network before you connect the dapp.

## 5. Start the dev server

Pass the addresses from step 3:

```bash
INFURA_API_KEY=<your_infura_key> \
VOTING_CONTRACT=<voting address> \
DIRECTORY_CONTRACT=<directory address> \
TOKEN_CONTRACT=<token address> \
MULTICALL_CONTRACT=<multicall address> \
FEATURED_VOTING_CONTRACT=<featured voting address> \
pnpm --filter @status-im/community-dapp run dev
```

`INFURA_API_KEY` is required even in development, because `RequestClient` fetches community details over Waku. A key is often already in `apps/status.app/.env.local`. Open <http://localhost:8080>.
