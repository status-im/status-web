import { keccak256 } from 'js-sha3'
import { Reader } from 'protobufjs'
import secp256k1 from 'secp256k1'

import { Identity } from '../identity'
import * as proto from '../proto/status/v1/application_metadata_message'
import { ApplicationMetadataMessage_Type } from '../proto/status/v1/application_metadata_message'
import { hexToBuf } from '../utils'

import { ChatMessage } from './chat_message'

export class ApplicationMetadataMessage {
  private constructor(public proto: proto.ApplicationMetadataMessage) {}

  /**
   * Create a chat message to be sent to an Open (permission = no membership) community
   */
  public static create(
    payload: Uint8Array,
    type: ApplicationMetadataMessage_Type,
    identity: Identity
  ): ApplicationMetadataMessage {
    const signature = identity.sign(payload)

    const proto = {
      signature,
      payload,
      type,
    }

    return new ApplicationMetadataMessage(proto)
  }

  static decode(bytes: Uint8Array): ApplicationMetadataMessage {
    const protoBuf = proto.ApplicationMetadataMessage.decode(
      Reader.create(bytes)
    )

    return new ApplicationMetadataMessage(protoBuf)
  }

  encode(): Uint8Array {
    return proto.ApplicationMetadataMessage.encode(this.proto).finish()
  }

  public get signature(): Uint8Array | undefined {
    return this.proto.signature
  }

  public get payload(): Uint8Array | undefined {
    return this.proto.payload
  }
  public get type(): ApplicationMetadataMessage_Type | undefined {
    return this.proto.type
  }

  /**
   * Returns a chat message if the type is [TYPE_CHAT_MESSAGE], undefined otherwise.
   */
  public get chatMessage(): ChatMessage | undefined {
    if (!this.payload) return

    return ChatMessage.decode(this.payload)
  }

  public get signer(): Uint8Array | undefined {
    if (!this.signature || !this.payload) return

    const signature = this.signature.slice(0, 64)
    const recid = this.signature.slice(64)[0]
    const hash = keccak256(this.payload)

    return secp256k1.ecdsaRecover(signature, recid, hexToBuf(hash))
  }
}
