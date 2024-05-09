import { bootstrap } from '@libp2p/bootstrap'
import { Protocols } from '@waku/interfaces'
import { createDecoder } from '@waku/message-encryption/symmetric'
import { createLightNode, waitForRemotePeer } from '@waku/sdk'
import { bytesToHex, concatBytes } from 'ethereum-cryptography/utils'

import { isEncrypted } from '../client/community/is-encrypted'
import { contracts } from '../consts/contracts'
import { peers } from '../consts/peers'
import { providers } from '../consts/providers'
import { EthereumClient } from '../ethereum-client/ethereum-client'
import {
  ApplicationMetadataMessage,
  ApplicationMetadataMessage_Type,
} from '../protos/application-metadata-message_pb'
import {
  CommunityDescription,
  CommunityTokenPermission_Type,
} from '../protos/communities_pb'
import { ProtocolMessage } from '../protos/protocol-message_pb'
import { ContactCodeAdvertisement } from '../protos/push-notifications_pb'
import { SegmentMessage } from '../protos/segment-message_pb'
import { compressPublicKey } from '../utils/compress-public-key'
import { generateKeyFromPassword } from '../utils/generate-key-from-password'
import { idToContentTopic } from '../utils/id-to-content-topic'
import { isClockValid } from '../utils/is-clock-valid'
import { payloadToId } from '../utils/payload-to-id'
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
  ethProviderApiKey: string
  environment?: 'development' | 'preview' | 'production'
}

class RequestClient {
  public waku: LightNode
  /** Cache. */
  public readonly wakuMessages: Set<string>
  #segmentedWakuMessages: Map<string, Map<number, SegmentMessage>>

  #started: boolean

  #ethProviderURLs: Record<number, string>
  #ethProviderApiKey: string
  #ethereumClients: Map<number, EthereumClient>

  #contractAddresses: Record<number, Record<string, string>>

  constructor(
    waku: LightNode,
    options: {
      ethProviderApiKey: string
      ethProviderURLs?: Record<number, string>
      contractAddresses?: Record<number, Record<string, string>>
      started?: boolean
      environment?: 'development' | 'preview' | 'production'
    }
  ) {
    const { environment = 'development' } = options

    this.waku = waku
    this.wakuMessages = new Set()
    this.#segmentedWakuMessages = new Map()
    this.#started = options.started ?? false
    this.#ethProviderURLs =
      options.ethProviderURLs ?? providers[environment].infura
    this.#ethProviderApiKey = options.ethProviderApiKey
    this.#ethereumClients = new Map()
    this.#contractAddresses =
      options.contractAddresses ?? contracts[environment]
  }

  static async start(options: RequestClientOptions): Promise<RequestClient> {
    const { environment = 'development' } = options

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

      client = new RequestClient(waku, {
        started: true,
        ethProviderURLs: providers[environment].infura,
        ethProviderApiKey: options.ethProviderApiKey,
        contractAddresses: contracts[environment],
      })
    } catch (error) {
      if (waku) {
        await waku.stop()
      }

      throw error
    }

    return client
  }

  public async stop() {
    if (!this.#started) {
      throw new Error('Waku instance not created by class initialization')
    }

    await Promise.all([
      async () => this.waku.stop(),
      [...this.#ethereumClients.values()].map(async provider =>
        provider.stop()
      ),
    ])

    this.#started = false
  }

  private getEthereumClient = (chainId: number): EthereumClient | undefined => {
    const client = this.#ethereumClients.get(chainId)

    if (!client) {
      const url = this.#ethProviderURLs[chainId]

      if (!url) {
        return
      }

      const client = new EthereumClient(url + this.#ethProviderApiKey)

      return this.#ethereumClients.set(chainId, client).get(chainId)
    }

    return client
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
    communityPublicKey: string
  ): Promise<CommunityDescription | undefined> => {
    const contentTopic = idToContentTopic(communityPublicKey)
    const symmetricKey = await generateKeyFromPassword(communityPublicKey)

    const wakuMessageGenerator = this.waku.store.queryGenerator([
      createDecoder(contentTopic, symmetricKey, {
        clusterId: 16,
        shard: 32,
      }),
    ])
    for await (const wakuMessages of wakuMessageGenerator) {
      for await (const wakuMessage of wakuMessages) {
        if (!wakuMessage) {
          continue
        }

        // handle
        const message = this.handleWakuMessage(wakuMessage)
        if (!message) {
          continue
        }

        if (
          message.type !== ApplicationMetadataMessage_Type.COMMUNITY_DESCRIPTION
        ) {
          continue
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
          continue
        }

        if (isEncrypted(decodedCommunityDescription.tokenPermissions)) {
          // todo?: zod
          const permission = Object.values(
            decodedCommunityDescription.tokenPermissions
          ).find(
            permission =>
              permission.type ===
              CommunityTokenPermission_Type.BECOME_TOKEN_OWNER
          )

          if (!permission) {
            continue
          }

          const criteria = permission.tokenCriteria[0]
          const contracts = criteria?.contractAddresses
          const chainId = Object.keys(contracts)[0]

          if (!chainId) {
            continue
          }

          const providerUrl = this.#ethProviderURLs[Number(chainId)]

          if (!providerUrl) {
            continue
          }

          const ethereumClient = this.getEthereumClient(Number(chainId))

          if (!ethereumClient) {
            continue
          }

          const ownerPublicKey = await ethereumClient.resolveOwner(
            this.#contractAddresses[Number(chainId)]
              .CommunityOwnerTokenRegistry,
            communityPublicKey
          )

          if (ownerPublicKey !== message.signerPublicKey) {
            continue
          }
        } else if (
          communityPublicKey !==
          `0x${compressPublicKey(message.signerPublicKey)}`
        ) {
          continue
        }

        // stop
        return decodedCommunityDescription
      }
    }
  }

  private fetchContactCodeAdvertisement = async (
    publicKey: string
  ): Promise<ContactCodeAdvertisement | undefined> => {
    const contentTopic = idToContentTopic(`${publicKey}-contact-code`)
    const symmetricKey = await generateKeyFromPassword(
      `${publicKey}-contact-code`
    )

    const wakuMessageGenerator = this.waku.store.queryGenerator([
      createDecoder(contentTopic, symmetricKey, {
        clusterId: 16,
        shard: 32,
      }),
    ])
    for await (const wakuMessages of wakuMessageGenerator) {
      for await (const wakuMessage of wakuMessages) {
        if (!wakuMessage) {
          continue
        }

        // handle
        const message = this.handleWakuMessage(wakuMessage)

        if (!message) {
          continue
        }

        if (
          message.type !==
          ApplicationMetadataMessage_Type.CONTACT_CODE_ADVERTISEMENT
        ) {
          continue
        }

        // decode
        const decodedContactCode = ContactCodeAdvertisement.fromBinary(
          message.payload
        )

        // validate
        if (!decodedContactCode.chatIdentity) {
          continue
        }

        if (
          !isClockValid(
            BigInt(decodedContactCode.chatIdentity.clock),
            message.timestamp
          )
        ) {
          continue
        }

        if (publicKey !== message.signerPublicKey) {
          continue
        }

        // stop
        return decodedContactCode
      }
    }
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
    let messageToDecode = wakuMessage.payload // default

    try {
      const decodedSegment = SegmentMessage.fromBinary(messageToDecode)

      if (decodedSegment) {
        const unsegmentedMessageHash = bytesToHex(
          decodedSegment.entireMessageHash
        )

        const segmentedWakuMessages = this.#segmentedWakuMessages.get(
          unsegmentedMessageHash
        )

        if (!segmentedWakuMessages) {
          this.#segmentedWakuMessages.set(
            unsegmentedMessageHash,
            new Map([[decodedSegment.index, decodedSegment]])
          )

          return
        }

        if (segmentedWakuMessages.has(decodedSegment.index)) {
          return
        }

        segmentedWakuMessages.set(decodedSegment.index, decodedSegment)

        if (segmentedWakuMessages.size !== decodedSegment.segmentsCount) {
          return
        }

        try {
          const segmentedPayloads: Uint8Array[] = []
          segmentedWakuMessages.forEach(segment => {
            segmentedPayloads[segment.index] = segment.payload
          })
          const unsegmentedPayload = concatBytes(...segmentedPayloads)

          messageToDecode = unsegmentedPayload

          this.#segmentedWakuMessages.delete(unsegmentedMessageHash)
        } catch (error) {
          return
        }
      }
    } catch {
      // eslint-disable-next-line no-empty
    }

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
