// import { StoreCodec } from "js-waku";
import { getBootstrapNodes, StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import {
  ChatMessage as ApiChatMessage,
  ApplicationMetadataMessage,
  Identity,
  Messenger,
} from "status-communities/dist/cjs";

import { ChatMessage } from "../models/ChatMessage";

export function useMessenger(chatId: string, chatIdList: string[]) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
    {}
  );
  const [notifications, setNotifications] = useState<{
    [chatId: string]: number;
  }>({});

  const clearNotifications = useCallback((id: string) => {
    setNotifications((prevNotifications) => {
      return {
        ...prevNotifications,
        [id]: 0,
      };
    });
  }, []);

  const addNewMessage = useCallback(
    (sender: Uint8Array, content: string, date: Date, id: string) => {
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
        if (prevMessages?.[id]) {
          return {
            ...prevMessages,
            [id]: [...prevMessages[id], newMessage],
          };
        } else {
          return {
            ...prevMessages,
            [id]: [newMessage],
          };
        }
      });
      setNotifications((prevNotifications) => {
        return {
          ...prevNotifications,
          [id]: prevNotifications[id] + 1,
        };
      });
    },
    []
  );

  useEffect(() => {
    const createMessenger = async () => {
      const identity = Identity.generate();

      const messenger = await Messenger.create(identity, {
        bootstrap: getBootstrapNodes.bind({}, [
          "fleets",
          "wakuv2.test",
          "waku-websocket",
        ]),
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

      await Promise.all(
        chatIdList.map(async (id) => {
          await messenger.joinChat(id);
          const chat = messenger.chatsById.get(id);
          if (chat) {
            const messages = await messenger.waku.store.queryHistory(
              [chat.contentTopic],
              {
                decryptionKeys: [chat.symKey],
              }
            );
            messages.sort((a, b) =>
              (a?.timestamp?.getTime() ?? 0) > (b?.timestamp?.getTime() ?? 0)
                ? 1
                : -1
            );
            messages.forEach((message) => {
              if (message.payload) {
                const metadata = ApplicationMetadataMessage.decode(
                  message.payload
                );
                if (metadata.payload) {
                  const chatMessage = ApiChatMessage.decode(metadata.payload);
                  if (
                    metadata.signer &&
                    chatMessage.text &&
                    chatMessage.proto.timestamp
                  ) {
                    addNewMessage(
                      metadata.signer,
                      chatMessage.text,
                      new Date(chatMessage.proto.timestamp ?? 0),
                      id
                    );
                  }
                }
              }
              return undefined;
            });
          }
          clearNotifications(id);
          messenger.addObserver((message) => {
            addNewMessage(
              message.signer ?? new Uint8Array(),
              message.chatMessage?.text ?? "",
              new Date(message.chatMessage?.proto.timestamp ?? 0),
              id
            );
          }, id);
        })
      );
      setMessenger(messenger);
    };
    createMessenger();
  }, []);

  const sendMessage = useCallback(
    async (messageText: string) => {
      await messenger?.sendMessage(messageText, chatId);
      addNewMessage(
        messenger?.identity.publicKey ?? new Uint8Array(),
        messageText,
        new Date(),
        chatId
      );
    },
    [chatId, messenger]
  );

  return {
    messenger,
    messages: messages?.[chatId] ?? [],
    sendMessage,
    notifications,
    clearNotifications,
  };
}
