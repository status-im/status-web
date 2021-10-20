// import { StoreCodec } from "js-waku";
import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Community, Identity, Messenger } from "status-communities/dist/cjs";
import { ApplicationMetadataMessage } from "status-communities/dist/cjs";

import { ChatMessage } from "../models/ChatMessage";
import { loadIdentity, saveIdentity } from "../utils/identityStorage";
import { uintToImgUrl } from "../utils/uintToImgUrl";

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

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

export function useMessenger(chatId: string, communityKey: string) {
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  const [messages, setMessages] = useState<{ [chatId: string]: ChatMessage[] }>(
    {}
  );
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const [notifications, setNotifications] = useState<{
    [chatId: string]: number;
  }>({});
  const loadingPreviousMessages = useRef<{
    [chatId: string]: boolean;
  }>({});
  const lastLoadTime = useRef<{
    [chatId: string]: Date;
  }>({});
  const [lastMessage, setLastMessage] = useState(new Date());
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (lastLoadTime.current?.[chatId]) {
      setLastMessage(lastLoadTime.current?.[chatId]);
    }
  }, [chatId]);
  const clearNotifications = useCallback((id: string) => {
    setNotifications((prevNotifications) => {
      return {
        ...prevNotifications,
        [id]: 0,
      };
    });
  }, []);

  const addNewMessage = useCallback(
    (msg: ApplicationMetadataMessage, id: string, date: Date) => {
      if (
        msg.signer &&
        (msg.chatMessage?.text || msg.chatMessage?.image) &&
        msg.chatMessage.clock
      ) {
        const content = msg.chatMessage.text ?? "";
        let image: string | undefined = undefined;
        if (msg.chatMessage?.image) {
          image = uintToImgUrl(msg.chatMessage?.image.payload);
        }
        const sender = msg.signer.reduce(
          (p: string, c: number): string => p + c.toString(16),
          "0x"
        );
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
      }
    },
    []
  );

  const loadNextDay = useCallback(
    async (id: string) => {
      if (messenger) {
        const endTime = lastLoadTime.current[id] ?? new Date();
        const startTime = new Date(endTime.getTime() - _MS_PER_DAY);
        const timeDiff = Math.floor(
          (new Date().getTime() - endTime.getTime()) / _MS_PER_DAY
        );
        if (timeDiff < 30) {
          if (!loadingPreviousMessages.current[id]) {
            loadingPreviousMessages.current[id] = true;
            setLoadingMessages(true);
            const amountOfMessages = await messenger.retrievePreviousMessages(
              id,
              startTime,
              endTime
            );
            lastLoadTime.current[id] = startTime;
            if (id === chatId) {
              setLastMessage(startTime);
            }
            loadingPreviousMessages.current[id] = false;
            setLoadingMessages(false);
            if (amountOfMessages === 0) {
              loadNextDay(id);
            }
          }
        }
      }
    },
    [lastLoadTime, messenger, chatId]
  );

  useEffect(() => {
    const createMessenger = async () => {
      // Test password for now
      // Need design for password input

      let identity = await loadIdentity("test");
      if (!identity) {
        identity = Identity.generate();
        await saveIdentity(identity, "test");
      }
      const messenger = await Messenger.create(identity, {
        libp2p: {
          config: {
            pubsub: {
              enabled: true,
              emitSelf: true,
            },
          },
        },
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
      const community = await Community.instantiateCommunity(
        communityKey,
        messenger.waku
      );
      setCommunity(community);
      await Promise.all(
        Array.from(community.chats.values()).map(async (chat) => {
          await messenger.joinChat(chat);
          lastLoadTime.current[chat.id] = new Date();
          messenger.addObserver(
            (msg, date) => addNewMessage(msg, chat.id, date),
            chat.id
          );
          clearNotifications(chat.id);
        })
      );
      setMessenger(messenger);
    };
    createMessenger();
  }, []);

  useEffect(() => {
    if (messenger && community?.chats) {
      Array.from(community?.chats.values()).forEach(({ id }) =>
        loadNextDay(id)
      );
    }
  }, [messenger]);

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

  const activeMessages = useMemo(
    () => messages?.[chatId] ?? [],
    [messages, chatId]
  );

  useEffect(() => {
    setLoadingMessages(loadingPreviousMessages.current[chatId]);
  }, [chatId]);

  return {
    messenger,
    messages: activeMessages,
    sendMessage,
    notifications,
    clearNotifications,
    loadNextDay,
    lastMessage,
    loadingMessages,
    community,
  };
}
