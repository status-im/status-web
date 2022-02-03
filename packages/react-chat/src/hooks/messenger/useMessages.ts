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
  subscriptions: React.MutableRefObject<
    ((msg: ChatMessage, id: string) => void)[]
  >,
  contacts?: Contacts
) {
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
    {}
  );
  const { notifications, incNotification, clearNotifications } =
    useNotifications();

  const {
    notifications: mentions,
    incNotification: incMentions,
    clearNotifications: clearMentions,
  } = useNotifications();

  const addChatMessage = useCallback(
    (newMessage: ChatMessage | undefined, id: string) => {
      if (newMessage) {
        contacts?.addContact(newMessage.sender);
        setMessages((prev) => {
          if (newMessage.responseTo && prev[id]) {
            newMessage.quote = prev[id].find(
              (msg) => msg.id === newMessage.responseTo
            );
          }
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
        subscriptions.current.forEach((subscription) =>
          subscription(newMessage, id)
        );
        incNotification(id);
        if (
          identity &&
          newMessage.content.includes(`@${bufToHex(identity.publicKey)}`)
        ) {
          incMentions(id);
        }
      }
    },
    [contacts, identity, subscriptions, incMentions, incNotification]
  );

  const addMessage = useCallback(
    (msg: ApplicationMetadataMessage, id: string, date: Date) => {
      const newMessage = ChatMessage.fromMetadataMessage(msg, date);
      addChatMessage(newMessage, id);
    },
    [addChatMessage]
  );

  const activeMessages = useMemo(() => {
    if (messages?.[chatId]) {
      return [...messages[chatId]];
    }
    return [];
  }, [messages, chatId]);

  return {
    messages: activeMessages,
    addMessage,
    notifications,
    clearNotifications,
    mentions,
    clearMentions,
    addChatMessage,
  };
}
