import { useCallback, useMemo, useState } from "react";
import { ApplicationMetadataMessage } from "status-communities/dist/cjs";

import { ChatMessage } from "../../models/ChatMessage";
import { binarySetInsert } from "../../utils";

import { useNotifications } from "./useNotifications";

export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
    {}
  );
  const { notifications, incNotification, clearNotifications } =
    useNotifications();

  const addMessage = useCallback(
    (msg: ApplicationMetadataMessage, id: string, date: Date) => {
      const newMessage = ChatMessage.fromMetadataMessage(msg, date);
      if (newMessage) {
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
        console.log(`increase noti ${id}`);
        incNotification(id);
      }
    },
    []
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
  };
}
