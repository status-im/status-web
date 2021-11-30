import React, { createContext, useContext } from "react";
import { Identity } from "status-communities/dist/cjs";

import { MessengerType, useMessenger } from "../hooks/messenger/useMessenger";

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
});

export function useMessengerContext() {
  return useContext(MessengerContext);
}

interface MessengerProviderProps {
  children: React.ReactNode;
  communityKey?: string;
  identity?: Identity;
}

export function MessengerProvider({
  children,
  communityKey,
  identity,
}: MessengerProviderProps) {
  const messenger = useMessenger(communityKey, identity);
  return <MessengerContext.Provider value={messenger} children={children} />;
}
