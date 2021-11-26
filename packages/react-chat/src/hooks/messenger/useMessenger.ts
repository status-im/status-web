// import { StoreCodec } from "js-waku";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Community,
  Contacts as ContactsClass,
  Identity,
  Messenger,
} from "status-communities/dist/cjs";

import { ChannelData, ChannelsData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { CommunityData } from "../../models/CommunityData";
import { Contacts } from "../../models/Contact";
import { createCommunity } from "../../utils/createCommunity";
import { createMessenger } from "../../utils/createMessenger";
import { uintToImgUrl } from "../../utils/uintToImgUrl";

import { useGroupChats } from "./useGroupChats";
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
  mentions: { [chatId: string]: number };
  clearMentions: (id: string) => void;
  loadPrevDay: (id: string) => Promise<void>;
  loadingMessages: boolean;
  communityData: CommunityData | undefined;
  contacts: Contacts;
  setContacts: React.Dispatch<React.SetStateAction<Contacts>>;
  channels: ChannelsData;
  setChannel: (channel: ChannelData) => void;
  removeChannel: (channelId: string) => void;
  activeChannel: ChannelData;
  setActiveChannel: (channel: ChannelData) => void;
  createGroupChat: (members: string[]) => void;
};

export function useMessenger(
  communityKey: string | undefined,
  identity: Identity | undefined
) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>({
    id: "",
    name: "",
    description: "",
    type: "channel",
  });

  const chatId = useMemo(() => activeChannel.id, [activeChannel]);

  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);

  const [internalContacts, setInternalContacts] = useState<{
    [id: string]: number;
  }>({});

  const contactsClass = useMemo(() => {
    if (messenger && identity) {
      const newContacts = new ContactsClass(
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

  const [contacts, setContacts] = useState<Contacts>({});

  useEffect(() => {
    const now = Date.now();
    setContacts((prev) => {
      const newContacts: Contacts = {};
      Object.entries(internalContacts).forEach(([id, clock]) => {
        newContacts[id] = {
          id,
          online: clock > now - 301000,
          trueName: id.slice(0, 10),
          isUntrustworthy: false,
          blocked: false,
        };
        if (prev[id]) {
          newContacts[id] = { ...prev[id], ...newContacts[id] };
        }
      });
      return newContacts;
    });
  }, [internalContacts]);

  const {
    addChatMessage,
    addMessage,
    clearNotifications,
    notifications,
    messages,
    mentions,
    clearMentions,
  } = useMessages(chatId, identity, contactsClass);
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

  const [channels, setChannels] = useState<ChannelsData>({});

  const setChannel = useCallback((channel: ChannelData) => {
    setChannels((prev) => {
      return { ...prev, [channel.id]: channel };
    });
    setActiveChannel(channel);
  }, []);

  useEffect(() => {
    if (community?.chats) {
      for (const chat of community.chats.values()) {
        setChannel({
          id: chat.id,
          name: chat.communityChat?.identity?.displayName ?? "",
          description: chat.communityChat?.identity?.description ?? "",
          type: "channel",
        });
      }
    }
  }, [community]);

  useEffect(() => {
    Object.values(channels)
      .filter((channel) => channel.type === "dm")
      .forEach((channel) => {
        const contact = contacts?.[channel?.members?.[0]?.id ?? ""];
        if (contact && channel.name !== (contact?.customName ?? channel.name)) {
          setChannel({
            ...channel,
            name: contact?.customName ?? channel.name,
          });
        }
      });
  }, [contacts]);

  const communityData = useMemo(() => {
    if (community?.description) {
      Object.keys(community.description.proto.members).forEach((contact) =>
        contactsClass?.addContact(contact)
      );
      return {
        id: community.publicKeyStr,
        name: community.description.identity?.displayName ?? "",
        icon: uintToImgUrl(
          community.description?.identity?.images?.thumbnail?.payload ??
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

  const { groupChat, removeChannel, createGroupChat } = useGroupChats(
    messenger,
    identity,
    setChannels,
    setActiveChannel,
    addChatMessage,
    channels
  );

  const sendMessage = useCallback(
    async (messageText?: string, image?: Uint8Array) => {
      if (activeChannel.type === "group") {
        groupChat?.sendMessage(activeChannel.id, messageText ?? "");
      } else {
        if (messageText) {
          await messenger?.sendMessage(activeChannel.id, {
            text: messageText,
            contentType: 0,
          });
        }
        if (image) {
          await messenger?.sendMessage(activeChannel.id, {
            image,
            imageType: 1,
            contentType: 2,
          });
        }
      }
    },
    [messenger, groupChat, activeChannel]
  );

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
    setContacts,
    channels,
    setChannel,
    removeChannel,
    activeChannel,
    setActiveChannel,
    mentions,
    clearMentions,
    createGroupChat,
  };
}
