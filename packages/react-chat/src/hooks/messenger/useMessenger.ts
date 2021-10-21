// import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { Community, Messenger } from "status-communities/dist/cjs";

import { createCommunityMessenger } from "../../utils/createCommunityMessenger";

import { useLoadPrevDay } from "./useLoadPrevDay";
import { useMessages } from "./useMessages";

export function useMessenger(chatId: string, communityKey: string) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  const { addMessage, clearNotifications, notifications, messages } =
    useMessages(chatId);
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const { loadPrevDay, loadingMessages } = useLoadPrevDay(chatId, messenger);

  useEffect(() => {
    createCommunityMessenger(communityKey, addMessage).then((result) => {
      setCommunity(result.community);
      setMessenger(result.messenger);
    });
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
