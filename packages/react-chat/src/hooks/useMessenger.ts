// import { StoreCodec } from "js-waku";
import { getBootstrapNodes, StoreCodec } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { Identity, Messenger } from "status-communities/dist/cjs";
import { ApplicationMetadataMessage } from "status-communities/dist/cjs/application_metadata_message";

import { uintToImgUrl } from "../helpers/uintToImgUrl";
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
  const [lastLoadTime, setLastLoadTime] = useState<{
    [chatId: string]: Date;
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
    (
      signer: Uint8Array,
      content: string,
      date: Date,
      id: string,
      image?: string
    ) => {
      const sender = signer.reduce((p, c) => p + c.toString(16), "0x");
      const newMessage = { sender, content, date, image };
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
      if (
        msg.signer &&
        (msg.chatMessage?.text || msg.chatMessage?.image) &&
        msg.chatMessage.clock
      ) {
        const content = msg.chatMessage.text ?? "";
        let img: string | undefined = undefined;
        if (msg.chatMessage?.image) {
          img = uintToImgUrl(msg.chatMessage?.image.payload);
        }
        const date = new Date(msg.chatMessage.clock);
        addNewMessageRaw(msg.signer, content, date, id, img);
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
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          setLastLoadTime((prev) => {
            return {
              ...prev,
              [id]: yesterday,
            };
          });
          await messenger.retrievePreviousMessages(
            id,
            yesterday,
            today,
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

  const loadNextDay = useCallback(
    (id: string) => {
      if (messenger) {
        const endTime = lastLoadTime[id];
        const startTime = new Date();
        startTime.setDate(endTime.getDate() - 1);
        startTime.setHours(0, 0, 0, 0);

        messenger.retrievePreviousMessages(id, startTime, endTime, (messages) =>
          messages.forEach((msg) => addNewMessage(msg, id))
        );
        setLastLoadTime((prev) => {
          return {
            ...prev,
            [id]: startTime,
          };
        });
      }
    },
    [lastLoadTime, messenger]
  );

  const sendMessage = useCallback(
    async (messageText: string, image?: Uint8Array) => {
      let mediaContent = undefined;
      if (image) {
        mediaContent = {
          image,
          imageType: 1,
          contentType: 1,
        };
      }
      await messenger?.sendMessage(messageText, chatId, mediaContent);

      addNewMessageRaw(
        messenger?.identity.publicKey ?? new Uint8Array(),
        messageText,
        new Date(),
        chatId,
        image ? uintToImgUrl(image) : undefined
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
    loadNextDay,
    lastMessage: lastLoadTime[chatId],
  };
}
