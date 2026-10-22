# @status-im/ethereum-provider

EIP-1193 and EIP-6963 plumbing for the Status browser extensions: a `Provider` class, the `ProviderRpcError` the extension handlers throw, the message schemas passed between extension scripts, and three helpers that put the provider in a page. The wallet uses it in [apps/wallet/src/entrypoints/provider.content.ts](../../apps/wallet/src/entrypoints/provider.content.ts) and the connector in [apps/connector/src/contents/provider.ts](../../apps/connector/src/contents/provider.ts). Source in [src/index.ts](./src/index.ts).

## Install

```bash
pnpm add @status-im/ethereum-provider
```

`zod` 3.22 or newer is a peer dependency, because the message schemas are built with it. The helpers need `window`, so call them from a page or a content script rather than a service worker.

The package is public by name only and has never been published to npm. See [docs/deployment.md](../../docs/deployment.md#npm-packages).

## Usage

```ts
import {
  announceProvider,
  injectProvider,
  listenForProviderRequests,
  Provider,
  statusIcon,
} from '@status-im/ethereum-provider'

const provider = new Provider()
const info = {
  uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
  name: 'Status',
  icon: statusIcon,
  rdns: 'app.status',
}

listenForProviderRequests(provider, info) // answer eip6963:requestProvider
announceProvider(provider, info) // announce now, and on each request
injectProvider(provider) // define window.ethereum if nobody else has
```

Both extensions announce the same `rdns`, `app.status`, so a dapp that remembers which wallet it connected to finds either one.

`injectProvider` sets `window.ethereum` through `Object.defineProperty` and logs to the console when another extension got there first. `logger` is silent unless `localStorage['status:logging']` is `'true'`, which is the switch to flip when a dapp reports provider trouble.

The package also exports `ProviderRpcError`, the `RequestArguments`, `ProviderMessage` and `ProxyMessage` zod schemas with their inferred types, `statusIcon`, and the `ProviderEvent` and `EIP6963ProviderInfo` types.
