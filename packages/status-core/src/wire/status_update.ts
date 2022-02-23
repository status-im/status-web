import { Reader } from "protobufjs";

import * as proto from "../proto/communities/v1/status_update";

export class StatusUpdate {
  public constructor(public proto: proto.StatusUpdate) {}

  public static create(
    statusType: proto.StatusUpdate_StatusType,
    customText: string
  ): StatusUpdate {
    const clock = Date.now();

    const proto = {
      clock,
      statusType,
      customText,
    };

    return new StatusUpdate(proto);
  }

  /**
   * Decode the payload as CommunityChat message.
   *
   * @throws
   */
  static decode(bytes: Uint8Array): StatusUpdate {
    const protoBuf = proto.StatusUpdate.decode(Reader.create(bytes));

    return new StatusUpdate(protoBuf);
  }

  encode(): Uint8Array {
    return proto.StatusUpdate.encode(this.proto).finish();
  }

  public get clock(): number | undefined {
    return this.proto.clock;
  }

  public get statusType(): proto.StatusUpdate_StatusType | undefined {
    return this.proto.statusType;
  }

  public get customText(): string | undefined {
    return this.proto.customText;
  }
}
