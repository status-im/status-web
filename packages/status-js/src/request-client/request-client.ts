import { bootstrap } from '@libp2p/bootstrap'
import { Protocols } from '@waku/interfaces'
import { createDecoder } from '@waku/message-encryption/symmetric'
import { createLightNode, waitForRemotePeer } from '@waku/sdk'
import { bytesToHex } from 'ethereum-cryptography/utils'

import { isEncrypted } from '../client/community/is-encrypted'
import { peers } from '../consts/peers'
// import { EthereumClient } from '../ethereum-client/ethereum-client'
import {
  ApplicationMetadataMessage,
  ApplicationMetadataMessage_Type,
} from '../protos/application-metadata-message_pb'
import {
  CommunityDescription,
  // CommunityTokenPermission_Type,
} from '../protos/communities_pb'
import { ProtocolMessage } from '../protos/protocol-message_pb'
import { ContactCodeAdvertisement } from '../protos/push-notifications_pb'
import { compressPublicKey } from '../utils/compress-public-key'
import { generateKeyFromPassword } from '../utils/generate-key-from-password'
import { idToContentTopic } from '../utils/id-to-content-topic'
import { isClockValid } from '../utils/is-clock-valid'
import { payloadToId } from '../utils/payload-to-id'
// import { publicKeyToETHAddress } from '../utils/public-key-to-eth-address'
import { recoverPublicKey } from '../utils/recover-public-key'
import { mapChannel } from './map-channel'
import { mapCommunity } from './map-community'
import { mapUser } from './map-user'

import type { DecodedMessage } from '../client/community/handle-waku-message'
import type { ChannelInfo } from './map-channel'
import type { CommunityInfo } from './map-community'
import type { UserInfo } from './map-user'
import type { LightNode } from '@waku/interfaces'

export interface RequestClientOptions {
  environment?: 'test' // 'production' | 'test'
}

class RequestClient {
  public waku: LightNode
  /** Cache. */
  public readonly wakuMessages: Set<string>

  private started: boolean

  constructor(waku: LightNode, started = false) {
    this.waku = waku
    this.wakuMessages = new Set()
    this.started = started
  }

  static async start(options: RequestClientOptions): Promise<RequestClient> {
    const { environment = 'test' } = options

    let waku: LightNode | undefined
    let client: RequestClient | undefined

    try {
      // Waku
      waku = await createLightNode({
        defaultBootstrap: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        emitSelf: true,
        // pingKeepAlive: 0,
        // relayKeepAlive: 0,
        libp2p: {
          peerDiscovery: [
            bootstrap({
              list: peers[environment],
              timeout: 0,
              // note: Infinity prevents connection
              // tagTTL: Infinity,
            }),
          ],
        },
        shardInfo: {
          clusterId: 16,
          shards: [32],
        },
      })
      await waku.start()
      await waitForRemotePeer(waku, [Protocols.Store], 10 * 1000)

      const started = true
      client = new RequestClient(waku, started)
    } catch (error) {
      if (waku) {
        await waku.stop()
      }

      throw error
    }

    return client
  }

  public async stop() {
    if (!this.started) {
      throw new Error('Waku instance not created by class initialization')
    }

    await this.waku.stop()

    this.started = false
  }

  public fetchCommunity = async (
    /** Compressed */
    publicKey: string
  ): Promise<CommunityInfo | undefined> => {
    const communityDescription = await this.fetchCommunityDescription(publicKey)

    if (!communityDescription) {
      return
    }

    return mapCommunity(communityDescription)
  }

  public fetchChannel = async (
    /** Compressed */
    publicKey: string,
    uuid: string
  ): Promise<ChannelInfo | undefined> => {
    const communityDescription = await this.fetchCommunityDescription(publicKey)

    if (!communityDescription) {
      return
    }

    const communityChat = communityDescription.chats[uuid]

    return mapChannel(communityChat, communityDescription)
  }

  public fetchUser = async (
    /** Uncompressed */
    publicKey: string
  ): Promise<UserInfo | undefined> => {
    const contactCodeAdvertisement = await this.fetchContactCodeAdvertisement(
      publicKey
    )

    if (!contactCodeAdvertisement) {
      return
    }

    return mapUser(contactCodeAdvertisement, publicKey)
  }

  public fetchCommunityDescription = async (
    /** Compressed */
    publicKey: string
  ): Promise<CommunityDescription | undefined> => {
    const contentTopic = idToContentTopic(publicKey)
    const symmetricKey = await generateKeyFromPassword(publicKey)

    let communityDescription: CommunityDescription | undefined = undefined
    await this.waku.store.queryWithOrderedCallback(
      [
        createDecoder(contentTopic, symmetricKey, {
          clusterId: 16,
          shard: 32,
        }),
      ],
      wakuMessage => {
        // handle
        const message = this.handleWakuMessage(wakuMessage)

        if (!message) {
          return
        }

        if (
          message.type !== ApplicationMetadataMessage_Type.COMMUNITY_DESCRIPTION
        ) {
          return
        }

        // decode
        const decodedCommunityDescription = CommunityDescription.fromBinary(
          message.payload
        )

        // validate
        if (
          !isClockValid(
            BigInt(decodedCommunityDescription.clock),
            message.timestamp
          )
        ) {
          return
        }

        const signerPublicKey = `0x${compressPublicKey(
          message.signerPublicKey
        )}`

        // isSignatureValid
        if (isEncrypted(decodedCommunityDescription.tokenPermissions)) {
          // const permission = Object.values(
          //   decodedCommunityDescription.tokenPermissions
          // ).find(
          //   permission =>
          //     permission.type ===
          //     CommunityTokenPermission_Type.BECOME_TOKEN_OWNER
          // )
          // if (!permission) {
          //   return
          // }
          // const criteria = permission.tokenCriteria[0]
          // const contracts = criteria?.contractAddresses
          // const chainId = Object.keys(contracts)[0]
          // if (!chainId) {
          //   return
          // }
          // // get client config based on chainId
          // // get client
          // const client = new EthereumClient(
          //   `https://mainnet.infura.io/v3/${process.env.KEY}`
          // )
          // // call status contract for chainId
          // const address = publicKeyToETHAddress(publicKey)
          // // call contracts from previous call with address
          // const ownerPublicKey = '0x0'
          // if (ownerPublicKey !== signerPublicKey) {
          //   return
          // }
        } else if (publicKey !== signerPublicKey) {
          return
        }

        if (!communityDescription) {
          communityDescription = decodedCommunityDescription
        }

        // stop
        return true
      },
      {
        timeFilter: {
          startTime: new Date('2024-03-14'),
          endTime: new Date(),

          // startTime: new Date(),
          // endTime: new Date('2024-03-14'),
        },
      }
    )

    return communityDescription
  }

  private fetchContactCodeAdvertisement = async (
    publicKey: string
  ): Promise<ContactCodeAdvertisement | undefined> => {
    const contentTopic = idToContentTopic(`${publicKey}-contact-code`)
    const symmetricKey = await generateKeyFromPassword(
      `${publicKey}-contact-code`
    )

    let contactCodeAdvertisement: ContactCodeAdvertisement | undefined =
      undefined
    await this.waku.store.queryWithOrderedCallback(
      [
        createDecoder(contentTopic, symmetricKey, {
          clusterId: 16,
          shard: 32,
        }),
      ],
      wakuMessage => {
        // handle
        const message = this.handleWakuMessage(wakuMessage)

        if (!message) {
          return
        }

        if (
          message.type !==
          ApplicationMetadataMessage_Type.CONTACT_CODE_ADVERTISEMENT
        ) {
          return
        }

        // decode
        const decodedContactCode = ContactCodeAdvertisement.fromBinary(
          message.payload
        )

        // validate
        if (!decodedContactCode.chatIdentity) {
          return
        }

        if (
          !isClockValid(
            BigInt(decodedContactCode.chatIdentity.clock),
            message.timestamp
          )
        ) {
          return
        }

        if (publicKey !== message.signerPublicKey) {
          return
        }

        if (!contactCodeAdvertisement) {
          contactCodeAdvertisement = decodedContactCode
        }

        // stop
        return true
      }
    )

    return contactCodeAdvertisement
  }

  private handleWakuMessage = (
    wakuMessage: DecodedMessage
  ):
    | {
        timestamp: Date
        signerPublicKey: string
        type: ApplicationMetadataMessage_Type
        payload: Uint8Array
      }
    | undefined => {
    // validate
    if (!wakuMessage.payload) {
      return
    }

    if (!wakuMessage.signaturePublicKey) {
      return
    }

    if (!wakuMessage.timestamp) {
      return
    }

    // decode (layers)
    let messageToDecode = wakuMessage.payload
    let decodedProtocol
    try {
      decodedProtocol = ProtocolMessage.fromBinary(messageToDecode)

      if (decodedProtocol.encryptedMessage.none) {
        messageToDecode = decodedProtocol.encryptedMessage.none.payload
      } else if (decodedProtocol) {
        messageToDecode = decodedProtocol.publicMessage
      }
    } catch {
      // eslint-disable-next-line no-empty
    }

    let decodedMetadata
    try {
      decodedMetadata = ApplicationMetadataMessage.fromBinary(messageToDecode)
    } catch {
      return
    }

    if (
      !decodedMetadata ||
      !decodedMetadata.payload ||
      !decodedMetadata.signature.length
    ) {
      return
    }

    const signerPublicKeyBytes = recoverPublicKey(
      decodedMetadata.signature,
      decodedMetadata.payload
    )

    const messageId = payloadToId(
      decodedProtocol?.publicMessage ?? wakuMessage.payload,
      signerPublicKeyBytes
    )

    // already handled
    if (this.wakuMessages.has(messageId)) {
      return
    }

    this.wakuMessages.add(messageId)

    return {
      timestamp: wakuMessage.timestamp,
      signerPublicKey: `0x${bytesToHex(signerPublicKeyBytes)}`,
      type: decodedMetadata.type,
      payload: decodedMetadata.payload,
    }
  }
}

export async function createRequestClient(
  options: RequestClientOptions
): Promise<RequestClient> {
  return await RequestClient.start(options)
}

export { RequestClient }
