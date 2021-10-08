import { Reader } from "protobufjs";

import * as proto from "../proto/communities/v1/chat_identity";

export class ChatIdentity {
  public constructor(public proto: proto.ChatIdentity) {}

  static decode(bytes: Uint8Array): ChatIdentity {
    const protoBuf = proto.ChatIdentity.decode(Reader.create(bytes));

    return new ChatIdentity(protoBuf);
  }

  encode(): Uint8Array {
    return proto.ChatIdentity.encode(this.proto).finish();
  }
}
