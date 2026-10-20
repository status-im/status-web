# @status-im/ethereum-provider

Browser provider helpers for Status: injects `window.ethereum` and announces the wallet through
EIP-6963. Used by `apps/connector` and `apps/wallet`.

## Install

The package has a public name but has never been published. Publishing currently has no automated
flow; see [docs/deployment.md](../../docs/deployment.md#npm-packages).

## Usage

    import { injectProvider, announceProvider, listenForProviderRequests } from '@status-im/ethereum-provider'

Exports `Provider`, `ProviderRpcError`, `logger`, `statusIcon`, `injectProvider`,
`announceProvider`, `listenForProviderRequests`, and the `RequestArguments`, `ProviderMessage` and
`ProxyMessage` types.
