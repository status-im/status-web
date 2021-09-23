import { expect } from "chai";

import { ApplicationMetadataMessage } from "./application_metadata_message";
import { Identity } from "./identity";
import { Messenger } from "./messenger";

const testChatId = "test-chat-id";

describe("Messenger", () => {
  let messengerAlice: Messenger;
  let messengerBob: Messenger;

  beforeEach(async function () {
    this.timeout(10_000);

    const identityAlice = Identity.generate();
    const identityBob = Identity.generate();

    [messengerAlice, messengerBob] = await Promise.all([
      Messenger.create(identityAlice),
      Messenger.create(identityBob, {
        libp2p: { addresses: { listen: ["/ip4/0.0.0.0/tcp/0/ws"] } },
      }),
    ]);

    // Connect both messengers together for test purposes
    messengerAlice.waku.addPeerToAddressBook(
      messengerBob.waku.libp2p.peerId,
      messengerBob.waku.libp2p.multiaddrs
    );

    await Promise.all([
      new Promise((resolve) =>
        messengerAlice.waku.libp2p.pubsub.once(
          "pubsub:subscription-change",
          () => resolve(null)
        )
      ),
      new Promise((resolve) =>
        messengerBob.waku.libp2p.pubsub.once("pubsub:subscription-change", () =>
          resolve(null)
        )
      ),
    ]);
  });

  it("Sends & Receive message in public chat", async function () {
    this.timeout(10_000);

    messengerAlice.joinChat(testChatId);
    messengerBob.joinChat(testChatId);

    const text = "This is a message.";

    const receivedMessagePromise: Promise<ApplicationMetadataMessage> =
      new Promise((resolve) => {
        messengerBob.addObserver((message) => {
          resolve(message);
        }, testChatId);
      });

    await messengerAlice.sendMessage(text, testChatId);

    const receivedMessage = await receivedMessagePromise;

    expect(receivedMessage.chatMessage?.text).to.eq(text);
  });

  afterEach(async function () {
    this.timeout(5000);
    await messengerAlice.stop();
    await messengerBob.stop();
  });
});
