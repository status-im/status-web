import { Community, Messenger } from "@waku/status-communities/dist/cjs";
import { ApplicationMetadataMessage } from "@waku/status-communities/dist/cjs";

export async function createCommunity(
  communityKey: string,
  addMessage: (msg: ApplicationMetadataMessage, id: string, date: Date) => void,
  messenger: Messenger
) {
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
  return community;
}
