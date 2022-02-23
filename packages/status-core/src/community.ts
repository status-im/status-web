import debug from "debug";
import { Waku } from "js-waku";

import { Chat } from "./chat";
import { bufToHex, hexToBuf } from "./utils";
import { CommunityChat } from "./wire/community_chat";
import { CommunityDescription } from "./wire/community_description";

const dbg = debug("communities:community");

export class Community {
  public publicKey: Uint8Array;
  private waku: Waku;
  public chats: Map<string, Chat>; // Chat id, Chat
  public description?: CommunityDescription;

  constructor(publicKey: Uint8Array, waku: Waku) {
    this.publicKey = publicKey;
    this.waku = waku;
    this.chats = new Map();
  }

  /**
   * Instantiate a Community by retrieving its details from the Waku network.
   *
   * This class is used to interact with existing communities only,
   * the Status Desktop or Mobile app must be used to manage a community.
   *
   * @param publicKey The community's public key in hex format.
   * Can be found in the community's invite link: https://join.status.im/c/<public key>
   * @param waku The Waku instance, used to retrieve Community information from the network.
   */
  public static async instantiateCommunity(
    publicKey: string,
    waku: Waku
  ): Promise<Community> {
    const community = new Community(hexToBuf(publicKey), waku);

    await community.refreshCommunityDescription();

    return community;
  }

  public get publicKeyStr(): string {
    return bufToHex(this.publicKey);
  }

  /**
   * Retrieve and update community information from the network.
   * Uses most recent community description message available.
   */
  async refreshCommunityDescription(): Promise<void> {
    const desc = await CommunityDescription.retrieve(
      this.publicKey,
      this.waku.store
    );

    if (!desc) {
      dbg(`Failed to retrieve Community Description for ${this.publicKeyStr}`);
      return;
    }

    this.description = desc;

    await Promise.all(
      Array.from(this.description.chats).map(([chatUuid, communityChat]) => {
        return this.instantiateChat(chatUuid, communityChat);
      })
    );
  }

  /**
   * Instantiate [[Chat]] object based on the passed chat name.
   * The Chat MUST already be part of the Community and the name MUST be exact (including casing).
   *
   * @throws string If the Community Description is unavailable or the chat is not found;
   */
  private async instantiateChat(
    chatUuid: string,
    communityChat: CommunityChat
  ): Promise<void> {
    if (!this.description)
      throw "Failed to retrieve community description, cannot instantiate chat";

    const chatId = this.publicKeyStr + chatUuid;
    if (this.chats.get(chatId)) return;

    const chat = await Chat.create(chatId, communityChat);

    this.chats.set(chatId, chat);
  }
}
