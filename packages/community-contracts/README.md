# @status-im/community-contracts

Foundry contracts behind the Status community directory, where SNT holders vote to add or remove communities. The dapp reads them through the ABIs in [`abi/`](./abi). Private package, not published to npm.

## Contracts

- [`contracts/Directory.sol`](./contracts/Directory.sol): the community list and the featured subset. Only the two voting contracts can write to it.
- [`contracts/VotingContract.sol`](./contracts/VotingContract.sol): one room per add-or-remove vote, with a voting period and a verification period. A room passes when votes for outweigh votes against.
- [`contracts/FeaturedVotingContract.sol`](./contracts/FeaturedVotingContract.sol): one global vote at a time to pick the featured communities, with a cooldown per community.
- [`contracts/Multicall2.sol`](./contracts/Multicall2.sol): batched reads, deployed by the deployment script on Anvil only.

Votes are EIP-712 signatures submitted in batches, and each voter's balance is checked at a block rather than trusted from the signed amount. The ABIs in [`abi/index.ts`](./abi/index.ts) are compiled from `out/`, so run `forge build` before importing `@status-im/community-contracts/abi`; `apps/community-dapp` does that for you in its `predev` and `prebuild` scripts.

## Build and test

    forge build       # compile
    forge test        # run the suite in test/
    forge fmt         # format Solidity

Or with pnpm from this directory: `pnpm build`, `pnpm test`, `pnpm lint` (solhint and a prettier check), `pnpm lint:fix`. Solidity 0.8.20, EVM `paris`, optimizer at 10,000 runs; the rest of the build settings are in [`foundry.toml`](./foundry.toml). `lib/` holds forge-std, minime and openzeppelin-contracts as submodules.

## Deploying

    forge script script/DeployContracts.s.sol --rpc-url <rpc> --broadcast

[`script/DeploymentConfig.s.sol`](./script/DeploymentConfig.s.sol) picks the network config from the chain id: Anvil (31337) deploys a MiniMeToken and mints 100,000,000 tokens to the broadcaster, Optimism mainnet (10), Goerli (420) and Sepolia (11155420) use the deployed SNT, and any other chain reverts. The broadcaster comes from `ETH_FROM`, then `MNEMONIC`, and falls back to the test mnemonic in [`script/Base.s.sol`](./script/Base.s.sol). Variable names are in [`.env.example`](./.env.example).

## Deployments

Addresses in use by `@status-im/community-dapp`. The source of truth is [`apps/community-dapp/src/config.ts`](../../apps/community-dapp/src/config.ts).

| Network                       | Directory                                                                                                                                  | VotingContract                                                                                                                             | FeaturedVotingContract                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Optimism Sepolia (preview)    | [`0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab`](https://optimism-sepolia.blockscout.com/address/0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab) | [`0x7Ff554af5b6624db2135E4364F416d1D397f43e6`](https://optimism-sepolia.blockscout.com/address/0x7Ff554af5b6624db2135E4364F416d1D397f43e6) | [`0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B`](https://optimism-sepolia.blockscout.com/address/0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B) |
| Optimism Mainnet (production) | [`0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A`](https://optimistic.etherscan.io/address/0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A)         | [`0x321Ba646d994200257Ce4bfe18F66C9283ad1407`](https://optimistic.etherscan.io/address/0x321Ba646d994200257Ce4bfe18F66C9283ad1407)         | [`0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0`](https://optimistic.etherscan.io/address/0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0)         |

The SNT and Multicall2 addresses per network are in [`script/DeploymentConfig.s.sol`](./script/DeploymentConfig.s.sol).

## More

- [Protocol properties](docs/properties.md): the invariants the contracts have to uphold.
