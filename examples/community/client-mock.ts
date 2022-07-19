import { spy, stub } from 'sinon'

import { createClient as _createClient } from '../../packages/status-js/src/client/client'

import type {
  Client,
  ClientOptions,
} from '../../packages/status-js/src/client/client'

// todo?: no need
// todo?: create prior load
let client: Client

async function createClient(options: ClientOptions): Promise<Client> {
  if (!client) {
    client = await _createClient(options)

    // todo: sinon sandbox
    spy(client)
    spy(client.community)

    globalThis.client = client
    // try {
    //   globalThis.obj = await globalThis.getObj()
    // } catch (error) {
    //   console.error(error)
    // }
  }

  return client
}

export { Client, ClientOptions, createClient }
