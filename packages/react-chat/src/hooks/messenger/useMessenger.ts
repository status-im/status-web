// import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Community,
  Contacts,
  Identity,
  Messenger,
} from "status-communities/dist/cjs";

import { ChatMessage } from "../../models/ChatMessage";
import { Contact } from "../../models/Contact";
import { createCommunity } from "../../utils/createCommunity";
import { createMessenger } from "../../utils/createMessenger";

import { useLoadPrevDay } from "./useLoadPrevDay";
import { useMessages } from "./useMessages";

export type MessengerType = {
  messenger: Messenger | undefined;
  messages: ChatMessage[];
  sendMessage: (
    messageText?: string | undefined,
    image?: Uint8Array | undefined
  ) => Promise<void>;
  notifications: { [chatId: string]: number };
  clearNotifications: (id: string) => void;
  loadPrevDay: (id: string) => Promise<void>;
  loadingMessages: boolean;
  community: Community | undefined;
  contacts: Contact[];
};

export function useMessenger(
  chatId: string,
  communityKey: string | undefined,
  identity: Identity | undefined
) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);

  const [internalContacts, setInternalContacts] = useState<{
    [id: string]: number;
  }>({});

  const contactsClass = useMemo(() => {
    if (messenger && identity) {
      const newContacts = new Contacts(
        identity,
        messenger.waku,
        (id, clock) => {
          setInternalContacts((prev) => {
            return { ...prev, [id]: clock };
          });
        }
      );
      return newContacts;
    }
  }, [messenger, identity]);

  const contacts = useMemo<Contact[]>(() => {
    const now = Date.now();
    const newContacts: Contact[] = [];
    Object.entries(internalContacts).forEach(([id, clock]) => {
      newContacts.push({
        id,
        online: clock > now - 301000,
      });
    });
    return newContacts;
  }, [internalContacts]);

  const { addMessage, clearNotifications, notifications, messages } =
    useMessages(chatId, contactsClass);
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const { loadPrevDay, loadingMessages } = useLoadPrevDay(chatId, messenger);

  useEffect(() => {
    if (identity) {
      createMessenger(identity).then((e) => {
        setMessenger(e);
      });
    }
  }, [identity]);

  useEffect(() => {
    if (messenger && contactsClass && communityKey) {
      createCommunity(communityKey, addMessage, messenger).then((e) => {
        setCommunity(e);
      });
    }
  }, [messenger, communityKey, addMessage, contactsClass]);

  useEffect(() => {
    if (messenger && community?.chats) {
      Array.from(community?.chats.values()).forEach(({ id }) =>
        loadPrevDay(id)
      );
    }
  }, [messenger, community]);

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
    contacts,
  };
}
