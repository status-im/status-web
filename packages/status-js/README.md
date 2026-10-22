# @status-im/js

Client library for Status communities. It joins a community over Waku, keeps the community description and chats in sync, sends messages, and resolves community metadata through the request client. The package also carries the Ethereum client used for contract calls and the protobuf types generated from the Status specs. Entry point [src/index.ts](./src/index.ts).

## Install

```bash
pnpm add @status-im/js
```

Node 22 or newer. The package is ESM with a CommonJS build alongside, and it runs in the browser.

## Usage

```ts
import { createClient } from '@status-im/js'

const client = await createClient({
  publicKey: '<community public key>',
  environment: 'production',
})

client.community.chats // Map of chat uuid to chat
client.onConnection(connected => console.log({ connected }))
```

`createClient` starts a Waku light node, connects to the Status fleet, fetches the community description and subscribes to updates. It throws if the description never arrives, so wrap it if the community key can be wrong. Call `client.stop()` when you are done with it.

`environment` defaults to `development`, and `development` and `preview` point at the same peers as `production` (see [src/consts/peers.ts](./src/consts/peers.ts), also exported as `peers`). Pick `production` explicitly instead of relying on the default.

The request client resolves channels, communities and users from the Status network:

```ts
import { createRequestClient } from '@status-im/js'

const requestClient = await createRequestClient({
  ethProviderApiKey: '<Infura key>',
  environment: 'production',
})

const community = await requestClient.fetchCommunity('<compressed public key>')
```

## Subpath exports

`@status-im/js/create-url` builds the `status.app/c` and `status.app/cc` share links. `@status-im/js/encode-url-data` encodes and decodes the payload inside those links; it uses Node's `zlib` for brotli, so import it from server code such as a Next.js page or route handler, not from a client bundle.

## Publishing

The version on npm is behind this repo, and publishing is by hand with no owner. See [docs/deployment.md](../../docs/deployment.md#npm-packages).
