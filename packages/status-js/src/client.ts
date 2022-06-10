/**
 * @see https://specs.status.im/spec/1
 */

// todo!: handle already received (emoji) events (by messageId or event)
// todo: use Map
// todo: write class for channels
// todo: use single proto runtime

// todo: tests

// todo: handle disconnections; no messages after sleep; libp2p;
// todo: identities/members?
// todo?: observe channels
// todo?: rename channels to chats
// todo?: multiple communityCallback
// todo?: call onChannel* separately
// todo?: ignore messages of not yet approved users
// todo?: ignore messages with invalid signature
// todo?: handle encrypted waku messages
// todo?: handle waku messages/events without identity

import { hexToBytes } from 'ethereum-cryptography/utils'
import { Waku, WakuMessage } from 'js-waku'

import { ApplicationMetadataMessage } from '~/protos/application-metadata-message'

import { Account } from './account'
import { Community } from './client/community/community'
import { handleWakuMessage } from './client/community/handle-waku-message'

export interface ClientOptions {
  publicKey: string
  env?: 'production' | 'test'
}

class Client {
  private waku: Waku
  public readonly wakuMessages: Set<string>

  public account?: Account
  public community: Community

  constructor(waku: Waku, options: ClientOptions) {
    // Waku
    this.waku = waku
    this.wakuMessages = new Set()

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
          // '/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/8000/wss/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ',
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

    // TODO: joining part of creation of an account
    // await this.community.requestToJoin()

    return this.account
  }

  // TODO?: should this exist
  // public deleteAccount = () => {
  //   this.account = undefined
  // }

  public sendMessage = async (
    type: keyof typeof ApplicationMetadataMessage.Type,
    payload: Uint8Array,
    contentTopic: string,
    symKey: Uint8Array
  ) => {
    if (!this.waku) {
      throw new Error('Waku not started')
    }

    if (!this.account) {
      throw new Error('Account not created')
    }

    const signature = await this.account.sign(payload)

    const message = ApplicationMetadataMessage.encode({
      type: type as ApplicationMetadataMessage.Type,
      signature,
      payload,
    })

    const wakuMesage = await WakuMessage.fromBytes(message, contentTopic, {
      sigPrivKey: hexToBytes(this.account.privateKey),
      symKey,
    })

    await this.waku.relay.send(wakuMesage)
  }

  public handleWakuMessage = (wakuMessage: WakuMessage): void => {
    handleWakuMessage(wakuMessage, this, this.community, this.account)
  }
}

export async function createClient(options: ClientOptions): Promise<Client> {
  const client = await Client.start(options)

  return client
}

export type { Client }
