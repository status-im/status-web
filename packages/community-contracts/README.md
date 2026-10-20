# @status-im/community-contracts

Foundry (Solidity) smart contracts for the Status community curation dApp: SNT holders vote to add or remove communities from the directory. Private package, not published to npm.

## Contracts

- [`contracts/Directory.sol`](./contracts/Directory.sol): the community directory
- [`contracts/VotingContract.sol`](./contracts/VotingContract.sol): votes to add or remove a community
- [`contracts/FeaturedVotingContract.sol`](./contracts/FeaturedVotingContract.sol): votes to feature a community
- [`contracts/Multicall2.sol`](./contracts/Multicall2.sol): batched reads

The ABIs are exported from [`abi/index.ts`](./abi/index.ts) for `@status-im/community-dapp`.

## Commands

    forge build       # compile
    forge test        # run the test suite
    forge fmt         # format Solidity

Or via pnpm from this directory:

    pnpm build   # forge build
    pnpm test    # forge test
    pnpm lint    # solhint plus prettier check
    pnpm lint:fix

Solidity 0.8.20, EVM `paris`, optimizer enabled at 10,000 runs; see [`foundry.toml`](./foundry.toml).

## Deploying

    forge script script/DeployContracts.s.sol --rpc-url <rpc> --broadcast

[`script/DeploymentConfig.s.sol`](./script/DeploymentConfig.s.sol) picks the network config from the chain ID. On Anvil (31337) it deploys a local MiniMeToken and mints 100,000,000 tokens to the broadcaster; on Optimism mainnet and Sepolia it uses the pre-deployed SNT token. The broadcaster comes from `ETH_FROM`, then `MNEMONIC`, defaulting to a test mnemonic (see [`script/Base.s.sol`](./script/Base.s.sol)).

## Deployments

Addresses in use by `@status-im/community-dapp`; the source of truth is [`apps/community-dapp/src/config.ts`](../../apps/community-dapp/src/config.ts).

| Network                       | Directory                                                                                                                                  | VotingContract                                                                                                                             | FeaturedVotingContract                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Optimism Sepolia (preview)    | [`0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab`](https://optimism-sepolia.blockscout.com/address/0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab) | [`0x7Ff554af5b6624db2135E4364F416d1D397f43e6`](https://optimism-sepolia.blockscout.com/address/0x7Ff554af5b6624db2135E4364F416d1D397f43e6) | [`0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B`](https://optimism-sepolia.blockscout.com/address/0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B) |
| Optimism Mainnet (production) | [`0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A`](https://optimistic.etherscan.io/address/0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A)         | [`0x321Ba646d994200257Ce4bfe18F66C9283ad1407`](https://optimistic.etherscan.io/address/0x321Ba646d994200257Ce4bfe18F66C9283ad1407)         | [`0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0`](https://optimistic.etherscan.io/address/0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0)         |

The SNT token and Multicall2 addresses per network are set in [`script/DeploymentConfig.s.sol`](./script/DeploymentConfig.s.sol).

## More

- [Protocol properties](docs/properties.md): the invariants the contracts must uphold.
