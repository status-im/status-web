// import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Community,
  Contacts,
  Identity,
  Messenger,
} from "status-communities/dist/cjs";

import { Contact } from "../../models/Contact";
import { createCommunity } from "../../utils/createCommunity";
import { createMessenger } from "../../utils/createMessenger";

import { useLoadPrevDay } from "./useLoadPrevDay";
import { useMessages } from "./useMessages";

export function useMessenger(
  chatId: string,
  communityKey: string,
  identity: Identity
) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);

  const [internalContacts, setInternalContacts] = useState<{
    [id: string]: number;
  }>({});

  const contactsClass = useMemo(() => {
    if (messenger) {
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
  }, [messenger]);

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
    createMessenger(identity).then((e) => {
      setMessenger(e);
    });
  }, []);

  useEffect(() => {
    if (messenger && contactsClass) {
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
