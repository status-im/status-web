// import { StoreCodec } from "js-waku";
import { getBootstrapNodes, StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { Identity, Messenger } from "status-communities/dist/cjs";
import { ApplicationMetadataMessage } from "status-communities/dist/cjs/application_metadata_message";

import { ChatMessage } from "../models/ChatMessage";

function binarySetInsert<T>(
  arr: T[],
  val: T,
  compFunc: (a: T, b: T) => boolean,
  eqFunc: (a: T, b: T) => boolean
) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (compFunc(arr[mid], val)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  if (arr.length === low || !eqFunc(arr[low], val)) {
    arr.splice(low, 0, val);
  }
  return arr;
}

export function useMessenger(chatId: string, chatIdList: string[]) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
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

  const addNewMessageRaw = useCallback(
    (signer: Uint8Array, content: string, date: Date, id: string) => {
      const sender = signer.reduce((p, c) => p + c.toString(16), "0x");
      const newMessage = { sender, content, date };
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
      setNotifications((prev) => {
        return {
          ...prev,
          [id]: prev[id] + 1,
        };
      });
    },
    []
  );

  const addNewMessage = useCallback(
    (msg: ApplicationMetadataMessage, id: string) => {
      if (msg.signer && msg.chatMessage?.text && msg.chatMessage.clock) {
        const content = msg.chatMessage.text;
        const date = new Date(msg.chatMessage.clock);
        addNewMessageRaw(msg.signer, content, date, id);
      }
    },
    [addNewMessageRaw]
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
        chatIdList.map(async (id) => await messenger.joinChat(id))
      );

      Promise.all(
        chatIdList.map(async (id) => {
          await messenger.retrievePreviousMessages(
            id,
            new Date(0),
            new Date(),
            (messages) => messages.forEach((msg) => addNewMessage(msg, id))
          );
          clearNotifications(id);
          messenger.addObserver((msg) => addNewMessage(msg, id), id);
        })
      );
      setMessenger(messenger);
    };
    createMessenger();
  }, []);

  const sendMessage = useCallback(
    async (messageText: string) => {
      await messenger?.sendMessage(messageText, chatId);
      addNewMessageRaw(
        messenger?.identity.publicKey ?? new Uint8Array(),
        messageText,
        new Date(),
        chatId
      );
    },
    [chatId, messenger]
  );

  useEffect(() => {
    setActiveMessages(messages?.[chatId] ?? []);
  }, [messages, chatId]);

  return {
    messenger,
    messages: activeMessages,
    sendMessage,
    notifications,
    clearNotifications,
  };
}
