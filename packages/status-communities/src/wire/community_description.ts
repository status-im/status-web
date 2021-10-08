import debug from "debug";
import { WakuMessage, WakuStore } from "js-waku";
import { Reader } from "protobufjs";

import { idToContentTopic } from "../contentTopic";
import * as proto from "../proto/communities/v1/communities";
import { bufToHex } from "../utils";

import { ChatIdentity } from "./chat_identity";
import { CommunityChat } from "./community_chat";

const dbg = debug("communities:wire:community_description");

export class CommunityDescription {
  private constructor(public proto: proto.CommunityDescription) {}

  static decode(bytes: Uint8Array): CommunityDescription {
    const protoBuf = proto.CommunityDescription.decode(Reader.create(bytes));

    return new CommunityDescription(protoBuf);
  }

  encode(): Uint8Array {
    return proto.CommunityDescription.encode(this.proto).finish();
  }

  /**
   * Retrieves the most recent Community Description it can find on the network.
   */
  public static async retrieve(
    communityPublicKey: Uint8Array,
    wakuStore: WakuStore
  ): Promise<CommunityDescription | undefined> {
    const hexCommunityPublicKey = bufToHex(communityPublicKey);
    const contentTopic = idToContentTopic(hexCommunityPublicKey);

    let communityDescription: CommunityDescription | undefined;

    const callback = (messages: WakuMessage[]): void => {
      // Value found, stop processing
      if (communityDescription) return;

      // Process most recent message first
      const orderedMessages = messages.reverse();
      orderedMessages.forEach((message: WakuMessage) => {
        if (!message.payload) return;
        try {
          const _communityDescription = CommunityDescription.decode(
            message.payload
          );

          if (!_communityDescription.identity) return;

          communityDescription = _communityDescription;
        } catch (e) {
          dbg(
            `Failed to decode message as CommunityDescription found on content topic ${contentTopic}`,
            e
          );
        }
      });
    };

    await wakuStore
      .queryHistory([contentTopic], {
        callback,
      })
      .catch((e) => {
        dbg(
          `Failed to retrieve community description for ${hexCommunityPublicKey}`,
          e
        );
      });

    return communityDescription;
  }

  get identity(): ChatIdentity | undefined {
    if (!this.proto.identity) return;

    return new ChatIdentity(this.proto.identity);
  }

  get chats(): Map<string, CommunityChat> {
    const map = new Map();

    for (const key of Object.keys(this.proto.chats)) {
      map.set(key, this.proto.chats[key]);
    }

    return map;
  }
}
