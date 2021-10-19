import { Reader } from "protobufjs";

import * as proto from "../proto/communities/v1/chat_identity";
import { IdentityImage } from "../proto/communities/v1/chat_identity";

export class ChatIdentity {
  public constructor(public proto: proto.ChatIdentity) {}

  static decode(bytes: Uint8Array): ChatIdentity {
    const protoBuf = proto.ChatIdentity.decode(Reader.create(bytes));

    return new ChatIdentity(protoBuf);
  }

  encode(): Uint8Array {
    return proto.ChatIdentity.encode(this.proto).finish();
  }

  /** Lamport timestamp of the message */
  get clock(): number | undefined {
    return this.proto.clock;
  }

  /** ens_name is the valid ENS name associated with the chat key */
  get ensName(): string | undefined {
    return this.proto.ensName;
  }

  /** images is a string indexed mapping of images associated with an identity */
  get images(): { [key: string]: IdentityImage } | undefined {
    return this.proto.images;
  }

  /** display name is the user set identity, valid only for organisations */
  get displayName(): string | undefined {
    return this.proto.displayName;
  }

  /** description is the user set description, valid only for organisations */
  get description(): string | undefined {
    return this.proto.description;
  }

  get color(): string | undefined {
    return this.proto.color;
  }

  get emoji(): string | undefined {
    return this.proto.emoji;
  }
}
