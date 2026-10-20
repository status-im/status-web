# @status-im/js

Status client library for the browser and Node.js: Waku-backed communities, chats and request
client, plus Ethereum utilities and protocol message types generated from the Status protobufs.

## Install

    pnpm add @status-im/js

Requires Node.js >= 22.

## Usage

    import { createClient, createRequestClient, EthereumClient, peers } from '@status-im/js'

    const client = await createClient({ publicKey: '0x...' })
    const requestClient = await createRequestClient({ ethProviderApiKey: '...' })

See `src/index.ts` for the full public surface. The `./encode-url-data` and `./create-url` subpath
exports provide URL helpers.

## Publishing

Published as `@status-im/js`. Publishing currently has no automated flow; see
[docs/deployment.md](../../docs/deployment.md#npm-packages).

## More

- [Agent guide](AGENTS.md)
