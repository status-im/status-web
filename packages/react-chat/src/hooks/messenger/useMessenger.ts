// import { StoreCodec } from "js-waku";
import {
  ApplicationMetadataMessage,
  Community,
  Contacts as ContactsClass,
  Identity,
  Messenger,
} from "@waku/status-communities/dist/cjs";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { useConfig } from "../../contexts/configProvider";
import { ChannelData, ChannelsData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { CommunityData } from "../../models/CommunityData";
import { Contacts } from "../../models/Contact";
import { createCommunity } from "../../utils/createCommunity";
import { createMessenger } from "../../utils/createMessenger";
import { uintToImgUrl } from "../../utils/uintToImgUrl";

import { ChannelAction, useChannelsReducer } from "./useChannelsReducer";
import { ContactsAction, useContacts } from "./useContacts";
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
  contactsDispatch: (action: ContactsAction) => void;
  addContact: (publicKey: string) => void;
  channels: ChannelsData;
  channelsDispatch: (action: ChannelAction) => void;
  removeChannel: (channelId: string) => void;
  activeChannel: ChannelData | undefined;
  createGroupChat: (members: string[]) => void;
  changeGroupChatName: (name: string, chatId: string) => void;
  addMembers: (members: string[], chatId: string) => void;
  nickname: string | undefined;
  subscriptionsDispatch: (action: SubscriptionAction) => void;
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
      const membersList = Object.keys(community.description.proto.members);

      if (contactsClass) {
        membersList.forEach(contactsClass.addContact, contactsClass);
      }

      return {
        id: community.publicKeyStr,
        name: community.description.identity?.displayName ?? "",
        icon: uintToImgUrl(
          community.description?.identity?.images?.thumbnail?.payload ??
            new Uint8Array()
        ),
        members: membersList.length,
        membersList,
        description: community.description.identity?.description ?? "",
      };
    } else {
      return undefined;
    }
  }, [community]);

  return { community, communityData };
}

type Subscriptions = {
  [id: string]: (msg: ChatMessage, id: string) => void;
};

type SubscriptionAction =
  | {
      type: "addSubscription";
      payload: {
        name: string;
        subFunction: (msg: ChatMessage, id: string) => void;
      };
    }
  | { type: "removeSubscription"; payload: { name: string } };

function subscriptionReducer(
  state: Subscriptions,
  action: SubscriptionAction
): Subscriptions {
  switch (action.type) {
    case "addSubscription": {
      if (state[action.payload.name]) {
        throw new Error("Subscription already exists");
      }
      return { ...state, [action.payload.name]: action.payload.subFunction };
    }
    case "removeSubscription": {
      if (state[action.payload.name]) {
        const newState = { ...state };
        delete newState[action.payload.name];
        return newState;
      }
      return state;
    }
    default:
      throw new Error("Wrong subscription action type");
  }
}

export function useMessenger(
  communityKey: string | undefined,
  identity: Identity | undefined,
  newNickname: string | undefined
) {
  const [subscriptions, subscriptionsDispatch] = useReducer(
    subscriptionReducer,
    {}
  );
  const subList = useMemo(() => Object.values(subscriptions), [subscriptions]);
  const [channelsState, channelsDispatch] = useChannelsReducer();
  const messenger = useCreateMessenger(identity);
  const { contacts, contactsDispatch, contactsClass, nickname } = useContacts(
    messenger,
    identity,
    newNickname
  );

  const addContact = useCallback(
    (publicKey: string) => {
      if (contactsClass) {
        contactsClass.addContact(publicKey);
      }
    },
    [contactsClass]
  );

  const {
    addChatMessage,
    addMessage,
    clearNotifications,
    notifications,
    messages,
    mentions,
    clearMentions,
  } = useMessages(
    channelsState?.activeChannel?.id,
    identity,
    subList,
    contactsClass
  );

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
          type: "AddChannel",
          payload: {
            id: chat.id,
            name: chat.communityChat?.identity?.displayName ?? "",
            description: chat.communityChat?.identity?.description ?? "",
            type: "channel",
          },
        });
      }
    }
  }, [community]);

  useEffect(() => {
    Object.values(channelsState.channels)
      .filter((channel) => channel.type === "dm")
      .forEach((channel) => {
        const contact = contacts?.[channel?.members?.[1]?.id ?? ""];
        if (
          contact &&
          channel.name !== (contact?.customName ?? contact.trueName)
        ) {
          channelsDispatch({
            type: "AddChannel",
            payload: {
              ...channel,
              name: contact?.customName ?? contact.trueName,
            },
          });
        }
      });
  }, [contacts, channelsState.channels]);

  const {
    groupChat,
    removeChannel,
    createGroupChat,
    changeGroupChatName,
    addMembers,
  } = useGroupChats(
    messenger,
    identity,
    channelsDispatch,
    addChatMessage,
    contactsClass
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
        if (channelsState.activeChannel.type !== "channel") {
          await groupChat?.sendMessage(
            channelsState.activeChannel.id,
            content,
            responseTo
          );
        } else {
          await messenger?.sendMessage(
            channelsState.activeChannel.id,
            content,
            responseTo
          );
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
    return Boolean(
      (communityKey && !communityData) ||
        !messenger ||
        (communityKey && !channelsState.activeChannel.id)
    );
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
    contactsDispatch,
    addContact,
    channels: channelsState.channels,
    channelsDispatch,
    removeChannel,
    activeChannel: channelsState.activeChannel,
    mentions,
    clearMentions,
    createGroupChat,
    changeGroupChatName,
    addMembers,
    nickname,
    subscriptionsDispatch,
  };
}
