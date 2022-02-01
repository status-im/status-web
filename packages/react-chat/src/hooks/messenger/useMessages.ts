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
  subscriptions: ((msg: ChatMessage, id: string) => void)[],
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
        if (newMessage.responseTo) {
          newMessage.quote = messages[id].find(
            (msg) => msg.id === newMessage.responseTo
          );
        }
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
        subscriptions.forEach((subscription) => subscription(newMessage, id));
        incNotification(id);
        if (
          identity &&
          newMessage.content.includes(`@${bufToHex(identity.publicKey)}`)
        ) {
          mentions.incNotification(id);
        }
      }
    },
    [contacts, identity, subscriptions]
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
