/**
 * @see https://specs.status.im/spec/1
 */

import { hexToBytes } from 'ethereum-cryptography/utils'
import { Protocols, waku_filter, waku_light_push, waku_store } from 'js-waku'
import { createLightNode } from 'js-waku/lib/create_waku'
import { PeerDiscoveryStaticPeers } from 'js-waku/lib/peer_discovery_static_list'
import { waitForRemotePeer } from 'js-waku/lib/wait_for_remote_peer'
import { SymEncoder } from 'js-waku/lib/waku_message/version_1'

import { peers } from '../consts/peers'
import { ApplicationMetadataMessage } from '../protos/application-metadata-message'
import { Account } from './account'
import { ActivityCenter } from './activityCenter'
import { Community } from './community/community'
import { handleWakuMessage } from './community/handle-waku-message'
import { LocalStorage } from './storage'

import type { Storage } from './storage'
import type { WakuLight } from 'js-waku/lib/interfaces'
import type { MessageV1 as WakuMessage } from 'js-waku/lib/waku_message/version_1'

const PROTOCOLS = [Protocols.Store, Protocols.Filter, Protocols.LightPush]
const CODECS = [
  waku_store.StoreCodec,
  waku_filter.FilterCodec,
  waku_light_push.LightPushCodec,
]
const THROWAWAY_ACCOUNT_STORAGE_KEY = 'throwaway_account'

export interface ClientOptions {
  /**
   * Public key of a community to join.
   */
  publicKey: string
  environment?: 'production' | 'test'
  /**
   * Custom storage for data persistance
   * @default window.localStorage
   */
  storage?: Storage
}

class Client {
  public waku: WakuLight
  public readonly wakuMessages: Set<string>
  /**
   * Tracks open connections which had their streams silently destroyed
   * and closes them so new connections can be automatically created
   * by libp2p's dial mechanism.
   *
   * For example, in case of a websocket in browser which did not
   * have its close event emitted.
   *
   * Note: Detection of the stream removal depends pinging the peer.
   *
   * Note: This is only a workaround (@see https://github.com/libp2p/js-libp2p/issues/939).
   */
  #wakuDisconnectionTimer: ReturnType<typeof setInterval>
  connected: boolean

  public activityCenter: ActivityCenter
  public community: Community

  #account?: Account
  #accountCallbacks = new Set<(account?: Account) => void>()

  storage: Storage

  constructor(waku: WakuLight, options: ClientOptions) {
    // Waku
    this.waku = waku
    this.wakuMessages = new Set()
    this.#wakuDisconnectionTimer = setInterval(async () => {
      const connectionsToClose: Promise<void>[] = []

      for (const connection of this.waku.libp2p.connectionManager.getConnections()) {
        try {
          await this.waku.libp2p.ping(connection.remoteAddr)
        } catch {
          connectionsToClose.push(connection.close())
        }
      }

      await Promise.allSettled(connectionsToClose)
    }, 10 * 1000)
    /**
     * Note: Assumes 1 remote node.
     */
    this.waku.libp2p.connectionManager.addEventListener(
      'peer:connect',
      async event => {
        const connection = event.detail
        const protocols = await this.waku.libp2p.peerStore.protoBook.get(
          connection.remotePeer
        )
        const isMissingProtocol = CODECS.some(
          codec => !protocols.includes(codec)
        )

        if (!isMissingProtocol) {
          this.connected = true
        }
      }
    )
    /**
     * >This event will **only** be triggered when the last connection is closed.
     * @see https://github.com/libp2p/js-libp2p/blob/bad9e8c0ff58d60a78314077720c82ae331cc55b/doc/API.md?plain=1#L2100
     */
    waku.libp2p.connectionManager.addEventListener('peer:disconnect', () => {
      this.connected = false
    })
    this.connected = true

    // Storage
    this.storage = options.storage ?? new LocalStorage()

    // Activity Center
    this.activityCenter = new ActivityCenter(this)

    // Community
    this.community = new Community(this, options.publicKey)

    // Restore account if exists
    const account = this.storage.getItem<Account>(THROWAWAY_ACCOUNT_STORAGE_KEY)
    if (account) {
      this.#account = new Account(this, account)
    }
  }

  static async start(options: ClientOptions): Promise<Client> {
    const { environment = 'production' } = options

    let waku: WakuLight | undefined
    let client: Client | undefined

    try {
      // Waku
      waku = await createLightNode({
        defaultBootstrap: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        emitSelf: true,
        /**
         * Note: Delegated to `wakuDisconnectionTimer`.
         */
        pingKeepAlive: 0,
        /**
         * Note: Not supported in light mode.
         */
        relayKeepAlive: 0,
        libp2p: {
          peerDiscovery: [
            /**
             * >only connects to 1 remote node because of the limited number of nodes
             * >run by Status and the limited number of connections provided by these nodes
             * >
             * >@see https://forum.vac.dev/t/waku-v2-scalability-studies/142/2
             */
            new PeerDiscoveryStaticPeers(peers[environment], { maxPeers: 1 }),
          ],
        },
      })
      await waku.start()
      await waitForRemotePeer(waku, PROTOCOLS, 10 * 1000)

      // Client
      client = new Client(waku, options)

      // Community
      await client.community.start()
    } catch (error) {
      if (client) {
        await client.stop()
      } else if (waku) {
        await waku.stop()
      }

      throw error
    }

    return client
  }

  public async stop() {
    clearInterval(this.#wakuDisconnectionTimer)
    await this.waku.stop()
  }

  get account() {
    return this.#account
  }

  set account(account: Account | undefined) {
    this.#account = account
    this.storage.setItem(THROWAWAY_ACCOUNT_STORAGE_KEY, this.#account)

    for (const callback of this.#accountCallbacks) {
      callback(this.#account)
    }
  }

  public createAccount(): Account {
    this.account = new Account(this)
    this.account.updateMembership(this.community)

    return this.account
  }

  public deleteAccount() {
    this.account = undefined
  }

  public onAccountChange(listener: (account?: Account) => void) {
    this.#accountCallbacks.add(listener)
    return () => {
      this.#accountCallbacks.delete(listener)
    }
  }

  public sendWakuMessage = async (
    type: keyof typeof ApplicationMetadataMessage.Type,
    payload: Uint8Array,
    contentTopic: string,
    symKey: Uint8Array
  ) => {
    if (!this.waku) {
      throw new Error('Waku not started')
    }

    if (!this.#account) {
      throw new Error('Account not created')
    }

    const signature = await this.#account.sign(payload)

    const message = ApplicationMetadataMessage.encode({
      type: type as ApplicationMetadataMessage.Type,
      signature,
      payload,
    })

    await this.waku.lightPush.push(
      new SymEncoder(
        contentTopic,
        symKey,
        hexToBytes(this.#account.privateKey)
      ),
      { payload: message }
    )
  }

  public handleWakuMessage = (wakuMessage: WakuMessage): void => {
    handleWakuMessage(wakuMessage, this, this.community, this.#account)
  }
}

export async function createClient(options: ClientOptions): Promise<Client> {
  const client = await Client.start(options)

  return client
}

export type { Client }
