import { Reader } from "protobufjs";

import * as proto from "../proto/communities/v1/communities";

export class CommunityChat {
  public constructor(public proto: proto.CommunityChat) {}

  static decode(bytes: Uint8Array): CommunityChat {
    const protoBuf = proto.CommunityChat.decode(Reader.create(bytes));

    return new CommunityChat(protoBuf);
  }

  encode(): Uint8Array {
    return proto.CommunityChat.encode(this.proto).finish();
  }
}
