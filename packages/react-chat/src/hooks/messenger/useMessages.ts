import {
  ApplicationMetadataMessage,
  Contacts,
  Identity,
} from "@waku/status-communities/dist/cjs";
import { bufToHex } from "@waku/status-communities/dist/cjs/utils";
import { useCallback, useMemo, useState } from "react";

import { ChatMessage } from "../../models/ChatMessage";
import { binarySetInsert } from "../../utils";

import { useNotifications } from "./useNotifications";

export function useMessages(
  chatId: string,
  identity: Identity | undefined,
  contacts?: Contacts
) {
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
    {}
  );
  const { notifications, incNotification, clearNotifications } =
    useNotifications();

  const mentions = useNotifications();

  const addChatMessage = useCallback(
    (newMessage: ChatMessage | undefined, id: string) => {
      if (newMessage) {
        contacts?.addContact(newMessage.sender);
        setMessages((prev) => {
          return {
            ...prev,
            [id]: binarySetInsert(
              prev?.[id] ?? [],
              newMessage,
              (a, b) => a.date < b.date,
              (a, b) => a.date.getTime() === b.date.getTime()
            ),
          };
        });
        incNotification(id);
        if (
          identity &&
          newMessage.content.includes(`@${bufToHex(identity.publicKey)}`)
        ) {
          mentions.incNotification(id);
        }
      }
    },
    [contacts, identity]
  );

  const addMessage = useCallback(
    (msg: ApplicationMetadataMessage, id: string, date: Date) => {
      const newMessage = ChatMessage.fromMetadataMessage(msg, date);
      addChatMessage(newMessage, id);
    },
    [contacts, identity]
  );

  const activeMessages = useMemo(
    () => messages?.[chatId] ?? [],
    [messages, chatId]
  );

  return {
    messages: activeMessages,
    addMessage,
    notifications,
    clearNotifications,
    mentions: mentions.notifications,
    clearMentions: mentions.clearNotifications,
    addChatMessage,
  };
}
