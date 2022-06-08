// todo: try protocol layer; then application data layer
// todo: replies; normalize messages (e.g. replies) prior returning
// todo: tests

// todo?: use clock for sorting

// todo: handle diff waku messages on diff topics

// todo: handle disconnections; no messages after sleep; libp2p;
// todo: identities/members?
// todo: validate sig
// todo: observer contact updates
// todo: observer channels
// todo?: rename channels to chats
// todo: change relative import paths
// todo?: multiple communityCallback
// todo?: call onChannel* separately

import { Waku } from 'js-waku'

import { Account } from './account'
import { Community } from './client/community/community'

export interface ClientOptions {
  publicKey: string
  env?: 'production' | 'test'
}

class Client {
  private waku: Waku

  public account?: Account
  public community: Community

  constructor(waku: Waku, options: ClientOptions) {
    // Waku
    this.waku = waku
    // Community
    this.community = new Community(this, waku, options.publicKey)
  }

  static async start(options: ClientOptions) {
    // Waku
    const waku = await Waku.create({
      bootstrap: {
        default: false,
        peers: [
          '/dns4/node-01.gc-us-central1-a.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmJb2e28qLXxT5kZxVUUoJt72EMzNGXB47Rxx5hw3q4YjS',
        ],
      },
    })
    await waku.waitForRemotePeer()

    // Client
    const client = new Client(waku, options)

    // Community
    await client.community.start()

    return client
  }

  public async stop() {
    await this.waku.stop()
  }

  public createAccount = (): Account => {
    this.account = new Account()

    return this.account
  }

  // TODO?: should this exist
  // public deleteAccount = () => {
  //   this.account = undefined
  // }
}

export async function createClient(options: ClientOptions): Promise<Client> {
  const client = await Client.start(options)

  return client
}

export type { Client }
