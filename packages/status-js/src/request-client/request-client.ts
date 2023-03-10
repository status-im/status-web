import { bytesToHex } from 'ethereum-cryptography/utils'
import { Protocols } from 'js-waku'
import { createLightNode } from 'js-waku/lib/create_waku'
import { PeerDiscoveryStaticPeers } from 'js-waku/lib/peer_discovery_static_list'
import { waitForRemotePeer } from 'js-waku/lib/wait_for_remote_peer'
import { SymDecoder } from 'js-waku/lib/waku_message/version_1'

import { peers } from '../consts/peers'
import {
  ApplicationMetadataMessage,
  ApplicationMetadataMessage_Type,
} from '../protos/application-metadata-message_pb'
import { CommunityDescription } from '../protos/communities_pb'
import { ProtocolMessage } from '../protos/protocol-message_pb'
import { ContactCodeAdvertisement } from '../protos/push-notifications_pb'
import { compressPublicKey } from '../utils/compress-public-key'
import { generateKeyFromPassword } from '../utils/generate-key-from-password'
import { idToContentTopic } from '../utils/id-to-content-topic'
import { isClockValid } from '../utils/is-clock-valid'
import { payloadToId } from '../utils/payload-to-id'
import { recoverPublicKey } from '../utils/recover-public-key'
import { mapChannel } from './map-channel'
import { mapCommunity } from './map-community'
import { mapUser } from './map-user'

import type { ChannelInfo } from './map-channel'
import type { CommunityInfo } from './map-community'
import type { UserInfo } from './map-user'
import type { WakuLight } from 'js-waku/lib/interfaces'
import type { MessageV1 as WakuMessage } from 'js-waku/lib/waku_message/version_1'

export interface RequestClientOptions {
  environment?: 'production' | 'test'
}

class RequestClient {
  public waku: WakuLight
  /** Cache. */
  public readonly wakuMessages: Set<string>

  constructor(waku: WakuLight) {
    this.waku = waku
    this.wakuMessages = new Set()
  }

  static async start(options: RequestClientOptions): Promise<RequestClient> {
    const { environment = 'production' } = options

    let waku: WakuLight | undefined
    let client: RequestClient | undefined

    try {
      // Waku
      waku = await createLightNode({
        defaultBootstrap: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        emitSelf: true,
        pingKeepAlive: 0,
        relayKeepAlive: 0,
        libp2p: {
          peerDiscovery: [
            new PeerDiscoveryStaticPeers(peers[environment], { maxPeers: 1 }),
          ],
        },
      })
      await waku.start()
      await waitForRemotePeer(waku, [Protocols.Store], 10 * 1000)

      client = new RequestClient(waku)
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
    await this.waku.stop()
  }

  public fetchCommunity = async (
    /** Uncompressed */
    publicKey: string
  ): Promise<CommunityInfo | undefined> => {
    const communityDescription = await this.fetchCommunityDescription(publicKey)

    if (!communityDescription) {
      return
    }

    return mapCommunity(communityDescription, publicKey)
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

    return mapChannel(communityChat, communityDescription, publicKey, uuid)
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

  // todo?: rename to fetchCommunityDetails/Info/Meta/Props
  private fetchCommunityDescription = async (
    /** Uncompressed */
    publicKey: string
  ): Promise<CommunityDescription | undefined> => {
    const contentTopic = idToContentTopic(publicKey)
    const symmetricKey = await generateKeyFromPassword(publicKey)

    let communityDescription: CommunityDescription | undefined = undefined
    await this.waku.store.queryOrderedCallback(
      [new SymDecoder(contentTopic, symmetricKey)],
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

        if (publicKey !== `0x${compressPublicKey(message.signerPublicKey)}`) {
          return
        }

        if (!communityDescription) {
          communityDescription = decodedCommunityDescription
        }

        // stop
        return true
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
    await this.waku.store.queryOrderedCallback(
      [new SymDecoder(contentTopic, symmetricKey)],
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

        // todo!: report js-waku abort logic
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
    wakuMessage: WakuMessage
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
      if (decodedProtocol) {
        messageToDecode = decodedProtocol.publicMessage
      }
    } catch {
      // eslint-disable-next-line no-empty
    }

    const decodedMetadata =
      ApplicationMetadataMessage.fromBinary(messageToDecode)
    if (!decodedMetadata.payload) {
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

export type { RequestClient }
