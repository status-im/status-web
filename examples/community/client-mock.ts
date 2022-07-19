// TODO?: remove
import { spy /*, stub*/ } from 'sinon'

import { createClient as _createClient } from '../../packages/status-js/src/client/client'

import type {
  Client,
  ClientOptions,
} from '../../packages/status-js/src/client/client'

// TODO?: remove
// TODO?: create prior load like js-waku-mock
let client: Client

async function createClient(options: ClientOptions): Promise<Client> {
  if (!client) {
    client = await _createClient(options)

    // TODO: sinon sandbox
    spy(client)
    spy(client.community)

    globalThis.client = client
  }

  return client
}

export { Client, ClientOptions, createClient }
