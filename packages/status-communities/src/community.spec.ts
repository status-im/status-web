import { expect } from "chai";
import { Waku } from "js-waku";

import { Community } from "./community";
import { CommunityDescription } from "./wire/community_description";

describe("Community live data", () => {
  before(function () {
    if (process.env.CI) {
      // Skip live data test in CI
      this.skip();
    }
  });

  it("Retrieves community description For DappConnect Test from Waku prod fleet", async function () {
    this.timeout(20000);
    const waku = await Waku.create({ bootstrap: true });

    await waku.waitForConnectedPeer();

    const community = await Community.instantiateCommunity(
      "0x0262c65c881f5a9f79343a26faaa02aad3af7c533d9445fb1939ed11b8bf4d2abd",
      waku
    );
    const desc = community.description as CommunityDescription;
    expect(desc).to.not.be.undefined;

    expect(desc.identity?.displayName).to.eq("DappConnect Test");
    const chats = Array.from(desc.chats.values()).map(
      (chat) => chat?.identity?.displayName
    );
    expect(chats).to.include("foobar");
    expect(chats).to.include("another-channel!");
  });
});
