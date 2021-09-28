import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { Identity, Messenger } from "status-communities/dist/cjs";

import { ChatMessage } from "../models/ChatMessage";

export function useMessenger(chatId: string) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
    {}
  );

  const addNewMessage = useCallback(
    (sender: Uint8Array, content: string, date: Date) => {
      let signer = "0x";
      sender.forEach((e) => {
        signer = signer + e.toString(16);
      });
      setMessages((prevMessages) => {
        const newMessage = {
          sender: signer,
          content: content,
          date: date,
        };
        return {
          ...prevMessages,
          [chatId]: [...prevMessages[chatId], newMessage],
        };
      });
    },
    [chatId]
  );

  useEffect(() => {
    const createMessenger = async () => {
      const identity = Identity.generate();
      const messenger = await Messenger.create(identity);
      await new Promise((resolve) => {
        messenger.waku?.libp2p.peerStore.on(
          "change:protocols",
          ({ protocols }) => {
            if (protocols.includes(StoreCodec)) {
              resolve("");
            }
          }
        );
      });
      await messenger.joinChat(chatId);
      setMessages((prevMessages) => {
        return { ...prevMessages, [chatId]: [] };
      });
      const chat = messenger.chatsById.get(chatId);
      const contentTopic = chat?.contentTopic;

      if (contentTopic) {
        const messages = await messenger.waku.store.queryHistory(
          [contentTopic],
          { decryptionKeys: [chat?.symKey] }
        );
        console.log(messages);
      }
      messenger.addObserver((message) => {
        addNewMessage(
          message.signer ?? new Uint8Array(),
          message.chatMessage?.text ?? "",
          new Date(message.chatMessage?.proto.timestamp ?? 0)
        );
      }, chatId);
      setMessenger(messenger);
    };
    createMessenger();
  }, []);

  useEffect(() => {
    const joinNewChat = async () => {
      try {
        await messenger?.joinChat(chatId);
        setMessages((prevMessages) => {
          return { ...prevMessages, [chatId]: [] };
        });
        messenger?.addObserver((message) => {
          addNewMessage(
            message.signer ?? new Uint8Array(),
            message.chatMessage?.text ?? "",
            new Date(message.chatMessage?.proto.timestamp ?? 0)
          );
        }, chatId);
      } catch {
        return;
      }
    };
    joinNewChat();
  }, [chatId]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      await messenger?.sendMessage(messageText, chatId);
      addNewMessage(
        messenger?.identity.publicKey ?? new Uint8Array(),
        messageText,
        new Date()
      );
    },
    [chatId, messenger]
  );

  return { messenger, messages: messages?.[chatId] ?? [], sendMessage };
}
