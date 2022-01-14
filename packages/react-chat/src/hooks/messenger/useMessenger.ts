// import { StoreCodec } from "js-waku";
import {
  ApplicationMetadataMessage,
  Community,
  Contacts as ContactsClass,
  Identity,
  Messenger,
} from "@waku/status-communities/dist/cjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useConfig } from "../../contexts/configProvider";
import { ChannelData, ChannelsData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { CommunityData } from "../../models/CommunityData";
import { Contacts } from "../../models/Contact";
import { createCommunity } from "../../utils/createCommunity";
import { createMessenger } from "../../utils/createMessenger";
import { uintToImgUrl } from "../../utils/uintToImgUrl";

import { useContacts } from "./useContacts";
import { useGroupChats } from "./useGroupChats";
import { useLoadPrevDay } from "./useLoadPrevDay";
import { useMessages } from "./useMessages";

export type MessengerType = {
  messenger: Messenger | undefined;
  messages: ChatMessage[];
  sendMessage: (
    messageText?: string | undefined,
    image?: Uint8Array | undefined,
    responseTo?: string
  ) => Promise<void>;
  notifications: { [chatId: string]: number };
  clearNotifications: (id: string) => void;
  mentions: { [chatId: string]: number };
  clearMentions: (id: string) => void;
  loadPrevDay: (id: string, groupChat?: boolean) => Promise<void>;
  loadingMessages: boolean;
  communityData: CommunityData | undefined;
  contacts: Contacts;
  setContacts: React.Dispatch<React.SetStateAction<Contacts>>;
  channels: ChannelsData;
  setChannel: (channel: ChannelData) => void;
  removeChannel: (channelId: string) => void;
  activeChannel: ChannelData | undefined;
  setActiveChannel: (channel: ChannelData) => void;
  createGroupChat: (members: string[]) => void;
  changeGroupChatName: (name: string, chatId: string) => void;
  addMembers: (members: string[], chatId: string) => void;
  nickname: string | undefined;
};

function useCreateMessenger(identity: Identity | undefined) {
  const { environment } = useConfig();
  const [messenger, setMessenger] = useState<Messenger | undefined>(undefined);
  useEffect(() => {
    createMessenger(identity, environment).then((e) => {
      setMessenger(e);
    });
  }, [identity]);
  return messenger;
}

function useCreateCommunity(
  messenger: Messenger | undefined,
  communityKey: string | undefined,
  addMessage: (msg: ApplicationMetadataMessage, id: string, date: Date) => void,
  contactsClass: ContactsClass | undefined
) {
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  useEffect(() => {
    if (messenger && communityKey && contactsClass) {
      createCommunity(communityKey, addMessage, messenger).then((comm) => {
        setCommunity(comm);
      });
    }
  }, [messenger, communityKey, addMessage, contactsClass]);

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

  return { community, communityData };
}

export function useMessenger(
  identity: Identity | undefined,
  newNickname: string | undefined
) {
  const { communityKey } = useConfig();
  const [activeChannel, setActiveChannel] = useState<ChannelData>({
    id: "",
    name: "",
    description: "",
    type: "channel",
  });

  const messenger = useCreateMessenger(identity);

  const { contacts, setContacts, contactsClass, nickname } = useContacts(
    messenger,
    identity,
    newNickname
  );

  const {
    addChatMessage,
    addMessage,
    clearNotifications,
    notifications,
    messages,
    mentions,
    clearMentions,
  } = useMessages(activeChannel.id, identity, contactsClass);

  const { community, communityData } = useCreateCommunity(
    messenger,
    communityKey,
    addMessage,
    contactsClass
  );

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

  const {
    groupChat,
    removeChannel,
    createGroupChat,
    changeGroupChatName,
    addMembers,
  } = useGroupChats(
    messenger,
    identity,
    setChannels,
    setActiveChannel,
    addChatMessage,
    channels
  );

  const { loadPrevDay, loadingMessages } = useLoadPrevDay(
    activeChannel.id,
    messenger,
    groupChat
  );

  useEffect(() => {
    if (messenger && community?.chats) {
      Array.from(community?.chats.values()).forEach(({ id }) =>
        loadPrevDay(id)
      );
    }
  }, [messenger, community]);

  const sendMessage = useCallback(
    async (messageText?: string, image?: Uint8Array, responseTo?: string) => {
      let content;
      if (messageText) {
        content = {
          text: messageText,
          contentType: 0,
        };
      }
      if (image) {
        content = {
          image,
          imageType: 1,
          contentType: 2,
        };
      }
      if (content) {
        if (activeChannel.type === "group") {
          await groupChat?.sendMessage(activeChannel.id, content, responseTo);
        } else {
          await messenger?.sendMessage(activeChannel.id, content, responseTo);
        }
      }
    },
    [messenger, groupChat, activeChannel]
  );

  useEffect(() => {
    if (activeChannel) {
      if (notifications[activeChannel.id] > 0) {
        clearNotifications(activeChannel.id);
        clearMentions(activeChannel.id);
      }
    }
  }, [notifications, activeChannel]);

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
    changeGroupChatName,
    addMembers,
    nickname,
  };
}
