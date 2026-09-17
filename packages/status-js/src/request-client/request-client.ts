import { fromBinary } from '@bufbuild/protobuf'
import { bootstrap } from '@libp2p/bootstrap'
import { Protocols } from '@waku/interfaces'
import { createDecoder } from '@waku/message-encryption/symmetric'
import { createLightNode, waitForRemotePeer } from '@waku/sdk'
import { bytesToHex, concatBytes } from 'ethereum-cryptography/utils'

import { contracts } from '../consts/contracts'
import { peers } from '../consts/peers'
import { providers } from '../consts/providers'
import { CLUSTER_ID, getRoutingInfo, SHARDS } from '../consts/waku'
import { EthereumClient } from '../ethereum-client/ethereum-client'
import {
  ApplicationMetadataMessage_Type,
  ApplicationMetadataMessageSchema,
} from '../protos/application-metadata-message_pb'
import {
  CommunityDescriptionSchema,
  CommunityTokenPermission_Type,
} from '../protos/communities_pb'
import { ProtocolMessageSchema } from '../protos/protocol-message_pb'
import { ContactCodeAdvertisementSchema } from '../protos/push-notifications_pb'
import { SegmentMessageSchema } from '../protos/segment-message_pb'
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
import type { CommunityDescription } from '../protos/communities_pb'
import type { ContactCodeAdvertisement } from '../protos/push-notifications_pb'
import type { SegmentMessage } from '../protos/segment-message_pb'
import type { ChannelInfo } from './map-channel'
import type { CommunityInfo } from './map-community'
import type { UserInfo } from './map-user'
import type { LightNode } from '@waku/interfaces'

type HandledWakuMessage = {
  timestamp: Date
  signerPublicKey: string
  type: ApplicationMetadataMessage_Type
  payload: Uint8Array
}

/** Thrown by a decode callback to abort the fetch; `fetchLatest` rethrows it to its caller. */
class StopFetch extends Error {}

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
    },
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
        networkConfig: {
          clusterId: CLUSTER_ID,
        },
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
        provider.stop(),
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

      const client = new EthereumClient(url + this.#ethProviderApiKey, chainId)

      return this.#ethereumClients.set(chainId, client).get(chainId)
    }

    return client
  }

  public fetchCommunity = async (
    /** Compressed */
    publicKey: string,
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
    uuid: string,
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
    publicKey: string,
  ): Promise<UserInfo | undefined> => {
    const contactCodeAdvertisement =
      await this.fetchContactCodeAdvertisement(publicKey)

    if (!contactCodeAdvertisement) {
      return
    }

    return mapUser(contactCodeAdvertisement, publicKey)
  }

  public fetchCommunityDescription = async (
    /** Compressed */
    communityPublicKey: string,
  ): Promise<CommunityDescription | undefined> => {
    const contentTopic = idToContentTopic(communityPublicKey)
    const symmetricKey = await generateKeyFromPassword(communityPublicKey)

    const ownerPublicKeys = new Map<number, Promise<string | undefined>>()

    try {
      return await this.fetchLatest(contentTopic, symmetricKey, {
        decode: async message => {
          if (
            message.type !==
            ApplicationMetadataMessage_Type.COMMUNITY_DESCRIPTION
          ) {
            return
          }

          const decodedCommunityDescription = fromBinary(
            CommunityDescriptionSchema,
            message.payload,
          )

          if (
            !isClockValid(
              BigInt(decodedCommunityDescription.clock),
              message.timestamp,
            )
          ) {
            return
          }

          const ownerTokenPermission = Object.values(
            decodedCommunityDescription.tokenPermissions,
          ).find(
            permission =>
              permission.type ===
              CommunityTokenPermission_Type.BECOME_TOKEN_OWNER,
          )
          // anyone holding the community key can publish to its topic, so an
          // unverifiable owner claim only invalidates this message, never the fetch
          if (ownerTokenPermission) {
            const contracts =
              ownerTokenPermission.tokenCriteria[0]?.contractAddresses ?? {}
            const chainId = Number(Object.keys(contracts)[0])

            if (!chainId) {
              return
            }

            // one registry lookup per fetch; every owner-signed description shares it
            let pendingOwnerPublicKey = ownerPublicKeys.get(chainId)
            if (!pendingOwnerPublicKey) {
              pendingOwnerPublicKey = this.resolveOwnerPublicKey(
                chainId,
                communityPublicKey,
              )
              ownerPublicKeys.set(chainId, pendingOwnerPublicKey)
            }

            let ownerPublicKey: string | undefined
            try {
              ownerPublicKey = await pendingOwnerPublicKey
            } catch {
              throw new StopFetch()
            }

            if (ownerPublicKey !== message.signerPublicKey) {
              return
            }
          } else if (
            communityPublicKey !==
            `0x${compressPublicKey(message.signerPublicKey)}`
          ) {
            return
          }

          return decodedCommunityDescription
        },
        getClock: description => BigInt(description.clock),
      })
    } catch (error) {
      // descriptions signed by the community key predate token ownership, so
      // they are stale whenever an owner-signed one could not be verified
      if (error instanceof StopFetch) {
        return
      }

      throw error
    }
  }

  /** Resolves to undefined when the chain has no registry or the community is not registered. */
  private resolveOwnerPublicKey = async (
    chainId: number,
    /** Compressed */
    communityPublicKey: string,
  ): Promise<string | undefined> => {
    const registryAddress =
      this.#contractAddresses[chainId]?.CommunityOwnerTokenRegistry
    const ethereumClient = this.getEthereumClient(chainId)

    if (!registryAddress || !ethereumClient) {
      return
    }

    return ethereumClient.resolveOwner(registryAddress, communityPublicKey)
  }

  private fetchContactCodeAdvertisement = async (
    publicKey: string,
  ): Promise<ContactCodeAdvertisement | undefined> => {
    const contentTopic = idToContentTopic(`${publicKey}-contact-code`)
    const symmetricKey = await generateKeyFromPassword(
      `${publicKey}-contact-code`,
    )

    return this.fetchLatest(contentTopic, symmetricKey, {
      decode: async message => {
        if (
          message.type !==
          ApplicationMetadataMessage_Type.CONTACT_CODE_ADVERTISEMENT
        ) {
          return
        }

        const decodedContactCode = fromBinary(
          ContactCodeAdvertisementSchema,
          message.payload,
        )

        if (!decodedContactCode.chatIdentity) {
          return
        }

        if (
          !isClockValid(
            BigInt(decodedContactCode.chatIdentity.clock),
            message.timestamp,
          )
        ) {
          return
        }

        if (publicKey !== message.signerPublicKey) {
          return
        }

        return decodedContactCode
      },
      getClock: contactCode => BigInt(contactCode.chatIdentity!.clock),
    })
  }

  /**
   * Queries every shard from its newest page and returns the valid message
   * with the highest clock. A page is sorted oldest-first regardless of the
   * pagination direction, so the whole page is evaluated before stopping.
   * Older pages are skipped once a page has a valid message: Status clocks
   * track wall time, so the newest page holds the highest clock in practice.
   */
  private fetchLatest = async <T>(
    contentTopic: string,
    symmetricKey: Uint8Array,
    options: {
      decode: (message: HandledWakuMessage) => Promise<T | undefined>
      getClock: (decoded: T) => bigint
    },
  ): Promise<T | undefined> => {
    let latest: { decoded: T; clock: bigint } | undefined

    for (const shardId of SHARDS) {
      try {
        const decoder = createDecoder(
          contentTopic,
          getRoutingInfo(shardId),
          symmetricKey,
        )
        const wakuMessageGenerator = this.waku.store.queryGenerator([decoder], {
          paginationForward: false,
        })

        for await (const wakuMessages of wakuMessageGenerator) {
          let found = false

          for await (const wakuMessage of wakuMessages) {
            if (!wakuMessage) {
              continue
            }

            const message = this.handleWakuMessage(wakuMessage)
            if (!message) {
              continue
            }

            let decoded: T | undefined
            try {
              decoded = await options.decode(message)
            } catch (error) {
              if (error instanceof StopFetch) {
                throw error
              }
              // malformed payload
              continue
            }
            if (!decoded) {
              continue
            }

            const clock = options.getClock(decoded)
            if (!latest || clock > latest.clock) {
              latest = { decoded, clock }
            }

            found = true
          }

          if (found) {
            break
          }
        }
      } catch (error) {
        if (error instanceof StopFetch) {
          throw error
        }
        // Query failed on this shard, try next
      }
    }

    return latest?.decoded
  }

  private handleWakuMessage = (
    wakuMessage: DecodedMessage,
  ): HandledWakuMessage | undefined => {
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
      const decodedSegment = fromBinary(SegmentMessageSchema, messageToDecode)

      if (decodedSegment) {
        const unsegmentedMessageHash = bytesToHex(
          decodedSegment.entireMessageHash,
        )

        const segmentedWakuMessages = this.#segmentedWakuMessages.get(
          unsegmentedMessageHash,
        )

        if (!segmentedWakuMessages) {
          this.#segmentedWakuMessages.set(
            unsegmentedMessageHash,
            new Map([[decodedSegment.index, decodedSegment]]),
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
        } catch {
          return
        }
      }
      // eslint-disable-next-line no-empty
    } catch {}

    let decodedProtocol
    try {
      decodedProtocol = fromBinary(ProtocolMessageSchema, messageToDecode)

      if (decodedProtocol.encryptedMessage.none) {
        messageToDecode = decodedProtocol.encryptedMessage.none.payload
      } else if (decodedProtocol) {
        messageToDecode = decodedProtocol.publicMessage
      }
      // eslint-disable-next-line no-empty
    } catch {}

    let decodedMetadata
    try {
      decodedMetadata = fromBinary(
        ApplicationMetadataMessageSchema,
        messageToDecode,
      )
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
      decodedMetadata.payload,
    )

    const messageId = payloadToId(
      decodedProtocol?.publicMessage ?? wakuMessage.payload,
      signerPublicKeyBytes,
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
  options: RequestClientOptions,
): Promise<RequestClient> {
  return await RequestClient.start(options)
}

export { RequestClient }
