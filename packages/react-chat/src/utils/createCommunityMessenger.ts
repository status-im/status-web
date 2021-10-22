import { StoreCodec } from "js-waku";
import { Community, Identity, Messenger } from "status-communities/dist/cjs";
import { ApplicationMetadataMessage } from "status-communities/dist/cjs";

const WAKU_OPTIONS = {
  libp2p: {
    config: {
      pubsub: {
        enabled: true,
        emitSelf: true,
      },
    },
  },
};

export async function createCommunityMessenger(
  communityKey: string,
  addMessage: (msg: ApplicationMetadataMessage, id: string, date: Date) => void,
  identity: Identity
) {
  const messenger = await Messenger.create(identity, WAKU_OPTIONS);
  await new Promise((resolve) => {
    messenger.waku.libp2p.peerStore.on("change:protocols", ({ protocols }) => {
      if (protocols.includes(StoreCodec)) {
        resolve("");
      }
    });
  });
  const community = await Community.instantiateCommunity(
    communityKey,
    messenger.waku
  );
  await Promise.all(
    Array.from(community.chats.values()).map(async (chat) => {
      await messenger.joinChat(chat);
      messenger.addObserver(
        (msg, date) => addMessage(msg, chat.id, date),
        chat.id
      );
    })
  );

  return { messenger, community, identity };
}
