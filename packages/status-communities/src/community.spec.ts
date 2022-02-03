import { expect } from "chai";
import { Waku } from "js-waku";

import { Community } from "./community";
import { CommunityDescription } from "./wire/community_description";

describe("Community [live data]", () => {
  before(function () {
    if (process.env.CI) {
      // Skip live data test in CI
      this.skip();
    }
  });

  it("Retrieves community description For DappConnect Test from Waku prod fleet", async function () {
    this.timeout(20000);
    const waku = await Waku.create({ bootstrap: { default: true } });

    await waku.waitForRemotePeer();

    const community = await Community.instantiateCommunity(
      "0x02cf13719c8b836bebd4e430c497ee38e798a43e4d8c4760c34bbd9bf4f2434d26",
      waku
    );
    const desc = community.description as CommunityDescription;
    expect(desc).to.not.be.undefined;

    expect(desc.identity?.displayName).to.eq("Test Community");

    const descChats = Array.from(desc.chats.values()).map(
      (chat) => chat?.identity?.displayName
    );
    expect(descChats).to.include("Test Chat");
    expect(descChats).to.include("Additional Chat");

    const chats = Array.from(community.chats.values()).map(
      (chat) => chat?.communityChat?.identity?.displayName
    );
    expect(chats).to.include("Test Chat");
    expect(chats).to.include("Additional Chat");
  });
});
