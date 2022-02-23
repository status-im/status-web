import { Reader } from 'protobufjs'

import * as proto from '../proto/communities/v1/communities'
import {
  CommunityMember,
  CommunityPermissions,
} from '../proto/communities/v1/communities'

import { ChatIdentity } from './chat_identity'

export class CommunityChat {
  public constructor(public proto: proto.CommunityChat) {}

  /**
   * Decode the payload as CommunityChat message.
   *
   * @throws
   */
  static decode(bytes: Uint8Array): CommunityChat {
    const protoBuf = proto.CommunityChat.decode(Reader.create(bytes))

    return new CommunityChat(protoBuf)
  }

  encode(): Uint8Array {
    return proto.CommunityChat.encode(this.proto).finish()
  }

  // TODO: check and document what is the key of the returned Map;
  public get members(): Map<string, CommunityMember> {
    const map = new Map()

    for (const key of Object.keys(this.proto.members)) {
      map.set(key, this.proto.members[key])
    }

    return map
  }

  public get permissions(): CommunityPermissions | undefined {
    return this.proto.permissions
  }

  public get identity(): ChatIdentity | undefined {
    if (!this.proto.identity) return

    return new ChatIdentity(this.proto.identity)
  }

  // TODO: Document this
  public get categoryId(): string | undefined {
    return this.proto.categoryId
  }

  // TODO: Document this
  public get position(): number | undefined {
    return this.proto.position
  }
}
