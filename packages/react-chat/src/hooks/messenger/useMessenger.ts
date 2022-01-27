// import { StoreCodec } from "js-waku";
import {
  ApplicationMetadataMessage,
  Community,
  Contacts as ContactsClass,
  Identity,
  Messenger,
} from "@waku/status-communities/dist/cjs";
import { ReducerAction, useCallback, useEffect, useMemo, useReducer, useState } from "react";

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
  loadingMessenger: boolean;
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

export type ChannelsState = {
  channels: ChannelsData,
  activeChannel: ChannelData,
}

export type ChannelAction = { type: "AddChannel", payload: ChannelData } | { type: "UpdateActive", payload: ChannelData } | { type: 'ChangeActive', payload: string } | { type: 'ToggleActiveMuted' } | {type:'RemoveChannel', payload:string};

function channelReducer(state: ChannelsState, action: ChannelAction): ChannelsState {
  switch (action.type) {
    case 'AddChannel': {
      const channels = { ...state.channels, [action.payload.id]: action.payload };
      return { channels, activeChannel: action.payload };
    }
    case 'UpdateActive': {
      const activeChannel = state.activeChannel
      if (activeChannel) {
        return { channels: { ...state.channels, [activeChannel.id]: action.payload }, activeChannel: action.payload }
      }
      return state
    }
    case 'ChangeActive': {
      const newActive = state.channels[action.payload]
      if (newActive) {
        return { ...state, activeChannel: newActive }
      }
      return state
    }
    case 'ToggleActiveMuted': {
      const activeChannel = state.activeChannel
      if (activeChannel) {
        const updatedChannel: ChannelData = { ...activeChannel, isMuted: !activeChannel.isMuted }
        return { channels: { ...state.channels, [activeChannel.id]: updatedChannel }, activeChannel: updatedChannel }
      }
      return state
    }
    case 'RemoveChannel': {
      delete state.channels[action.payload]
      return {...state, channels: state.channels}
    }
    default:

      throw new Error();
  }
  return state;
}

export function useMessenger(
  communityKey: string,
  identity: Identity | undefined,
  newNickname: string | undefined
) {

  const [channelsState, channelsDispatch] = useReducer(channelReducer, { channels: {}, activeChannel: {id:'',name:'',type:'channel'} } as ChannelsState)

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
  } = useMessages(channelsState?.activeChannel?.id, identity, contactsClass);

  const { community, communityData } = useCreateCommunity(
    messenger,
    communityKey,
    addMessage,
    contactsClass
  );

  useEffect(() => {
    if (community?.chats) {
      for (const chat of community.chats.values()) {
        channelsDispatch({
          type: 'AddChannel', payload: {
            id: chat.id,
            name: chat.communityChat?.identity?.displayName ?? "",
            description: chat.communityChat?.identity?.description ?? "",
            type: "channel",
          }
        })
      }
    }
  }, [community]);

  useEffect(() => {
    Object.values(channelsState.channels)
      .filter((channel) => channel.type === "dm")
      .forEach((channel) => {
        const contact = contacts?.[channel?.members?.[0]?.id ?? ""];
        if (contact && channel.name !== (contact?.customName ?? channel.name)) {
          channelsDispatch({
            type: 'AddChannel', payload:
            {
              ...channel,
              name: contact?.customName ?? channel.name,
            }
          })
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
    channelsState.activeChannel.id,
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
        if (channelsState.activeChannel.type === "group") {
          await groupChat?.sendMessage(channelsState.activeChannel.id, content, responseTo);
        } else {
          await messenger?.sendMessage(channelsState.activeChannel.id, content, responseTo);
        }
      }
    },
    [messenger, groupChat, channelsState.activeChannel]
  );

  useEffect(() => {
    if (channelsState.activeChannel) {
      if (notifications[channelsState.activeChannel.id] > 0) {
        clearNotifications(channelsState.activeChannel.id);
        clearMentions(channelsState.activeChannel.id);
      }
    }
  }, [notifications, channelsState]);

  const loadingMessenger = useMemo(() => {
    return !communityData || !messenger || !channelsState.activeChannel.id;
  }, [communityData, messenger, channelsState]);

  return {
    messenger,
    messages,
    sendMessage,
    notifications,
    clearNotifications,
    loadPrevDay,
    loadingMessages,
    loadingMessenger,
    communityData,
    contacts,
    setContacts,
    channels:channelsState.channels,
    setChannel,
    removeChannel,
    activeChannel:channelsState.activeChannel,
    setActiveChannel,
    mentions,
    clearMentions,
    createGroupChat,
    changeGroupChatName,
    addMembers,
    nickname,
  };
}
