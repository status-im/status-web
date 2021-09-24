import { expect } from "chai";
import { utils } from "js-waku";

import { ApplicationMetadataMessage } from "./application_metadata_message";
import { Identity } from "./identity";
import { Messenger } from "./messenger";

const testChatId = "test-chat-id";

describe("Messenger", () => {
  let messengerAlice: Messenger;
  let messengerBob: Messenger;
  let identityAlice: Identity;
  let identityBob: Identity;

  beforeEach(async function () {
    this.timeout(10_000);

    identityAlice = Identity.generate();
    identityBob = Identity.generate();

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

  it("Sends & Receive public chat messages", async function () {
    this.timeout(10_000);

    await messengerAlice.joinChat(testChatId);
    await messengerBob.joinChat(testChatId);

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

  it("public chat messages have signers", async function () {
    this.timeout(10_000);

    await messengerAlice.joinChat(testChatId);
    await messengerBob.joinChat(testChatId);

    const text = "This is a message.";

    const receivedMessagePromise: Promise<ApplicationMetadataMessage> =
      new Promise((resolve) => {
        messengerBob.addObserver((message) => {
          resolve(message);
        }, testChatId);
      });

    await messengerAlice.sendMessage(text, testChatId);

    const receivedMessage = await receivedMessagePromise;

    expect(utils.bufToHex(receivedMessage.signer!)).to.eq(
      utils.bufToHex(identityAlice.publicKey)
    );
  });

  afterEach(async function () {
    this.timeout(5000);
    await messengerAlice.stop();
    await messengerBob.stop();
  });
});
