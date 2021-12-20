import React, { createContext, useContext } from "react";

import { MessengerType, useMessenger } from "../hooks/messenger/useMessenger";
import { useIdentity, useNickname } from "./identityProvider";

const MessengerContext = createContext<MessengerType>({
  messenger: undefined,
  messages: [],
  sendMessage: async () => undefined,
  notifications: {},
  clearNotifications: () => undefined,
  mentions: {},
  clearMentions: () => undefined,
  loadPrevDay: async () => undefined,
  loadingMessages: false,
  communityData: undefined,
  contacts: {},
  setContacts: () => undefined,
  activeChannel: {
    id: "",
    name: "",
    type: "channel",
  },
  channels: {},
  setChannel: () => undefined,
  removeChannel: () => undefined,
  setActiveChannel: () => undefined,
  createGroupChat: () => undefined,
  changeGroupChatName: () => undefined,
  addMembers: () => undefined,
});

export function useMessengerContext() {
  return useContext(MessengerContext);
}

interface MessengerProviderProps {
  children: React.ReactNode;
  communityKey?: string;
}

export function MessengerProvider({
  children,
  communityKey,
}: MessengerProviderProps) {
  const identity = useIdentity();
  const nickname = useNickname();
  const messenger = useMessenger(communityKey, identity, nickname);
  return <MessengerContext.Provider value={messenger} children={children} />;
}
