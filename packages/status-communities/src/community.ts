import debug from "debug";
import { Waku } from "js-waku";

import { bufToHex, hexToBuf } from "./utils";
import { CommunityDescription } from "./wire/community_description";

const dbg = debug("communities:community");

export class Community {
  public publicKey: Uint8Array;
  private waku: Waku;

  public description?: CommunityDescription;

  constructor(publicKey: Uint8Array, waku: Waku) {
    this.publicKey = publicKey;
    this.waku = waku;
  }

  /**
   * Instantiate a Community by retrieving its details from the Waku network.
   *
   * This class is used to interact with existing communities only,
   * the Status Desktop or Mobile app must be used to manage a community.
   *
   * @param publicKey The community's public key in hex format.
   * Can be found in the community's invite link: https://join.status.im/c/<public key>
   */
  public async instantiateCommunity(
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
  }
}
