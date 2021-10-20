// import { StoreCodec } from "js-waku";
import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { Community, Identity, Messenger } from "status-communities/dist/cjs";

import { loadIdentity, saveIdentity } from "../../utils";

import { useLoadPrevDay } from "./useLoadPrevDay";
import { useMessages } from "./useMessages";

export function useMessenger(chatId: string, communityKey: string) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  const { addMessage, clearNotifications, notifications, messages } =
    useMessages(chatId);
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const { loadPrevDay, loadingMessages } = useLoadPrevDay(chatId, messenger);

  useEffect(() => {
    const createMessenger = async () => {
      // Test password for now
      // Need design for password input

      let identity = await loadIdentity("test");
      if (!identity) {
        identity = Identity.generate();
        await saveIdentity(identity, "test");
      }
      const messenger = await Messenger.create(identity, {
        libp2p: {
          config: {
            pubsub: {
              enabled: true,
              emitSelf: true,
            },
          },
        },
      });
      await new Promise((resolve) => {
        messenger.waku.libp2p.peerStore.on(
          "change:protocols",
          ({ protocols }) => {
            if (protocols.includes(StoreCodec)) {
              resolve("");
            }
          }
        );
      });
      const community = await Community.instantiateCommunity(
        communityKey,
        messenger.waku
      );
      setCommunity(community);
      await Promise.all(
        Array.from(community.chats.values()).map(async (chat) => {
          await messenger.joinChat(chat);
          messenger.addObserver(
            (msg, date) => addMessage(msg, chat.id, date),
            chat.id
          );
          clearNotifications(chat.id);
        })
      );
      setMessenger(messenger);
    };
    createMessenger();
  }, []);

  useEffect(() => {
    if (messenger && community?.chats) {
      Array.from(community?.chats.values()).forEach(({ id }) =>
        loadPrevDay(id)
      );
    }
  }, [messenger]);

  const sendMessage = useCallback(
    async (messageText?: string, image?: Uint8Array) => {
      if (messageText) {
        await messenger?.sendMessage(chatId, {
          text: messageText,
          contentType: 0,
        });
      }
      if (image) {
        await messenger?.sendMessage(chatId, {
          image,
          imageType: 1,
          contentType: 2,
        });
      }
    },
    [chatId, messenger]
  );

  return {
    messenger,
    messages,
    sendMessage,
    notifications,
    clearNotifications,
    loadPrevDay,
    loadingMessages,
    community,
  };
}
