import debug from 'debug'
import { Reader } from 'protobufjs'

import { idToContentTopic } from '../contentTopic'
import { createSymKeyFromPassword } from '../encryption'
// TODO: replace for 'packages/status-js/protos/communities.ts'
import * as proto from '../proto/communities/v1/communities'
import { bufToHex } from '../utils'
import { ApplicationMetadataMessage } from './application_metadata_message'
import { ChatIdentity } from './chat_identity'

import type { CommunityChat } from './community_chat'
import type { WakuMessage, WakuStore } from 'js-waku'

const dbg = debug('communities:wire:community_description')

export class CommunityDescription {
  private constructor(public proto: proto.CommunityDescription) {}

  static decode(bytes: Uint8Array): CommunityDescription {
    const protoBuf = proto.CommunityDescription.decode(Reader.create(bytes))

    return new CommunityDescription(protoBuf)
  }

  encode(): Uint8Array {
    return proto.CommunityDescription.encode(this.proto).finish()
  }

  /**
   * Retrieves the most recent Community Description it can find on the network.
   */
  public static async retrieve(
    communityPublicKey: Uint8Array,
    wakuStore: WakuStore
  ): Promise<CommunityDescription | undefined> {
    const hexCommunityPublicKey = bufToHex(communityPublicKey)
    // TEST: diff topic
    const contentTopic = idToContentTopic(hexCommunityPublicKey)

    let communityDescription: CommunityDescription | undefined

    const callback = (messages: WakuMessage[]): void => {
      // Value found, stop processing
      // FIXME?: return true/false
      if (communityDescription) return

      // Process most recent message first
      const orderedMessages = messages.reverse()
      orderedMessages.forEach((message: WakuMessage) => {
        if (!message.payload) return
        try {
          const metadata = ApplicationMetadataMessage.decode(message.payload)
          if (!metadata.payload) return

          const _communityDescription = CommunityDescription.decode(
            metadata.payload
          )

          if (!_communityDescription.identity) return

          communityDescription = _communityDescription
        } catch (e) {
          dbg(
            `Failed to decode message as CommunityDescription found on content topic ${contentTopic}`,
            e
          )
        }
      })

      // FIXME?: return true/false
    }

    const symKey = await createSymKeyFromPassword(hexCommunityPublicKey)

    await wakuStore
      .queryHistory([contentTopic], {
        callback,
        decryptionKeys: [symKey],
      })
      .catch(e => {
        dbg(
          `Failed to retrieve community description for ${hexCommunityPublicKey}`,
          e
        )
      })

    return communityDescription
  }

  get identity(): ChatIdentity | undefined {
    if (!this.proto.identity) return

    return new ChatIdentity(this.proto.identity)
  }

  get chats(): Map<string, CommunityChat> {
    const map = new Map()

    for (const key of Object.keys(this.proto.chats)) {
      map.set(key, this.proto.chats[key])
    }

    return map
  }
}
