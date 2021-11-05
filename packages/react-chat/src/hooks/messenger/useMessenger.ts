// import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Community,
  Contacts,
  Identity,
  Messenger,
} from "status-communities/dist/cjs";

import { ChannelData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { CommunityData } from "../../models/CommunityData";
import { Contact } from "../../models/Contact";
import { createCommunity } from "../../utils/createCommunity";
import { createMessenger } from "../../utils/createMessenger";
import { uintToImgUrl } from "../../utils/uintToImgUrl";

import { useLoadPrevDay } from "./useLoadPrevDay";
import { useMessages } from "./useMessages";

export type MessengerType = {
  messenger: Messenger | undefined;
  messages: ChatMessage[];
  sendMessage: (
    messageText?: string | undefined,
    image?: Uint8Array | undefined
  ) => Promise<void>;
  notifications: { [chatId: string]: number };
  clearNotifications: (id: string) => void;
  loadPrevDay: (id: string) => Promise<void>;
  loadingMessages: boolean;
  communityData: CommunityData | undefined;
  contacts: Contact[];
  channels: ChannelData[];
  activeChannel: ChannelData;
  setActiveChannel: (channel: ChannelData) => void;
};

export function useMessenger(
  communityKey: string | undefined,
  identity: Identity | undefined
) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>({
    id: "",
    name: "",
    description: "",
  });

  const chatId = useMemo(() => activeChannel.id, [activeChannel]);

  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);

  const [internalContacts, setInternalContacts] = useState<{
    [id: string]: number;
  }>({});

  const contactsClass = useMemo(() => {
    if (messenger && identity) {
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
  }, [messenger, identity]);

  const contacts = useMemo<Contact[]>(() => {
    const now = Date.now();
    return Object.entries(internalContacts).map(([id, clock]) => {
      return {
        id,
        online: clock > now - 301000,
      };
    });
  }, [internalContacts]);

  const { addMessage, clearNotifications, notifications, messages } =
    useMessages(chatId, contactsClass);
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const { loadPrevDay, loadingMessages } = useLoadPrevDay(chatId, messenger);

  useEffect(() => {
    if (identity) {
      createMessenger(identity).then((e) => {
        setMessenger(e);
      });
    }
  }, [identity]);

  useEffect(() => {
    if (messenger && communityKey && contactsClass) {
      createCommunity(communityKey, addMessage, messenger).then((comm) => {
        setCommunity(comm);
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

  const channels = useMemo<ChannelData[]>(() => {
    if (community?.chats) {
      return Array.from(community.chats.values()).map((chat) => {
        return {
          id: chat.id,
          name: chat.communityChat?.identity?.displayName ?? "",
          description: chat.communityChat?.identity?.description ?? "",
          type: "channel",
        };
      });
    } else {
      return [];
    }
  }, [community]);

  useEffect(() => {
    if (channels.length > 0) setActiveChannel(channels[0]);
  }, [channels]);

  const communityData = useMemo(() => {
    if (community?.description) {
      return {
        id: community.publicKeyStr,
        name: community.description.identity?.displayName ?? "",
        icon: uintToImgUrl(
          community.description?.identity?.images?.thumbnail.payload ??
            new Uint8Array()
        ),
        members: 0,
        membersList: Object.keys(community.description.proto.members),
        description: community.description.identity?.description ?? "",
      };
    } else {
      return undefined;
    }
  }, [community]);

  return {
    messenger,
    messages,
    sendMessage,
    notifications,
    clearNotifications,
    loadPrevDay,
    loadingMessages,
    communityData,
    contacts,
    channels,
    activeChannel,
    setActiveChannel,
  };
}
