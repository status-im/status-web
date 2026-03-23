# @status-im/community-dapp

Community directory curator dApp for Status — lets SNT holders vote on which communities are listed in the Status app.

## Prerequisites

| Tool                    | Version   | Install                                                     |
| ----------------------- | --------- | ----------------------------------------------------------- |
| Node.js                 | ≥ 22.17.0 | [nodejs.org](https://nodejs.org)                            |
| pnpm                    | ≥ 9       | `npm i -g pnpm`                                             |
| Foundry (forge + anvil) | latest    | `curl -L https://foundry.paradigm.xyz \| bash && foundryup` |

## Repository structure

```text
status-web/
├── apps/community/              # React dApp (this package)
│   └── src/
│       ├── config.ts            # Chain/contract addresses per environment
│       └── hooks/useAccount.ts  # Wallet connection logic
└── packages/community-contracts/
    ├── contracts/               # Solidity source
    └── script/                  # Forge deployment scripts
```

---

## Local development (against a local Anvil node)

### 1 — Install dependencies

From the monorepo root:

```bash
pnpm install
```

Initialize forge submodules (only needed once):

```bash
git submodule update --init --recursive packages/community-contracts/lib
```

### 2 — Start Anvil

In a dedicated terminal:

```bash
anvil
```

Anvil starts at `http://127.0.0.1:8545` with **chain ID 31337**.

Copy one of the printed private keys — you will import it into MetaMask.

> **SNT tokens:** The deploy script mints **100,000,000 SNT** to the deployer address (account #0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`). To vote you need at least 10,000 SNT, so either import account #0 into MetaMask or transfer SNT to your wallet:
>
> ```bash
> cast send <TOKEN_CONTRACT> \
>   "transfer(address,uint256)" \
>   <YOUR_WALLET_ADDRESS> \
>   50000000000000000000000 \
>   --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
>   --rpc-url http://127.0.0.1:8545
> ```
>
> `50000000000000000000000` = 50,000 SNT (18 decimals)

### 3 — Deploy contracts

In a separate terminal, from the monorepo root:

```bash
cd packages/community-contracts
forge script script/DeployContracts.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> The private key above is Anvil's default account #0. Replace with your own if needed.

The relevant part of the output looks like this:

```text
== Return ==
0: contract MiniMeToken 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
1: contract Directory 0x0B306BF915C4d645ff596e518fAf3F9669b97016
2: contract VotingContract 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
3: contract FeaturedVotingContract 0x9A676e781A523b5d0C0e43731313A708CB607508

== Logs ==
  contract Multicall2 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
```

> Addresses are different on every fresh Anvil run. Use the addresses from **your** output, not the examples above.

The addresses map to env variables as follows:

| `== Return ==` label             | env variable               |
| -------------------------------- | -------------------------- |
| `MiniMeToken`                    | `TOKEN_CONTRACT`           |
| `Directory`                      | `DIRECTORY_CONTRACT`       |
| `VotingContract`                 | `VOTING_CONTRACT`          |
| `FeaturedVotingContract`         | `FEATURED_VOTING_CONTRACT` |
| `Multicall2` (from `== Logs ==`) | `MULTICALL_CONTRACT`       |

### 4 — Configure MetaMask

1.  Add a custom network in MetaMask:
    - **Network name:** Anvil Localhost
    - **RPC URL:** `http://127.0.0.1:8545`
    - **Chain ID:** `31337`
    - **Currency symbol:** ETH

2.  Import an Anvil account using one of the private keys printed by `anvil`.
    (Recommended: account #1 `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`)

3.  Make sure MetaMask is switched to the **Anvil Localhost** network before connecting.

### 5 — Start the dev server

Fill in the addresses from step 3:

```bash
INFURA_API_KEY=<your_infura_key> \
VOTING_CONTRACT=0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82 \
DIRECTORY_CONTRACT=0x0B306BF915C4d645ff596e518fAf3F9669b97016 \
TOKEN_CONTRACT=0x610178dA211FEF7D417bC0e6FeD39F05609AD788 \
MULTICALL_CONTRACT=0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 \
FEATURED_VOTING_CONTRACT=0x9A676e781A523b5d0C0e43731313A708CB607508 \
pnpm --filter @status-im/community-dapp run dev
```

> Replace the example addresses above with the ones from **your** forge output.
> `INFURA_API_KEY` is required even in development — it is used by `RequestClient` to fetch community details from the Status/Waku network. The key can be found in `apps/status.app/.env.local`.

Open <http://localhost:8080> in your browser.

---

## Production build

```bash
# Preview (Optimism Sepolia)
ENV=preview INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp run build

# Production (Optimism Mainnet)
ENV=production INFURA_API_KEY=<key> pnpm --filter @status-im/community-dapp run build
```

Output is written to `apps/community/dist/`.

### Environment variables

| Variable                   | Required for | Description                                                                                                             |
| -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `ENV`                      | all          | `development` (default) / `preview` / `production`                                                                      |
| `INFURA_API_KEY`           | **all**      | Used by `RequestClient` to fetch community data from the Status/Waku network, and by Optimism RPC in preview/production |
| `VOTING_CONTRACT`          | development  | Deployed VotingContract address                                                                                         |
| `DIRECTORY_CONTRACT`       | development  | Deployed Directory address                                                                                              |
| `TOKEN_CONTRACT`           | development  | Deployed MiniMeToken address                                                                                            |
| `MULTICALL_CONTRACT`       | development  | Deployed Multicall2 address                                                                                             |
| `FEATURED_VOTING_CONTRACT` | development  | Deployed FeaturedVotingContract address                                                                                 |

---

## Contract development

```bash
cd packages/community-contracts

# Compile
forge build

# Test
forge test

# Format
forge fmt
```

## Community publick key

- zQ3shhxxHeXxc1jb72h6LK6jSz4HfNLELYBKyhaDfZRji8cMa
