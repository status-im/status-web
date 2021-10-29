import React, { createContext, useContext } from "react";
import { Identity } from "status-communities/dist/cjs";

import { MessengerType, useMessenger } from "../hooks/messenger/useMessenger";

const MessengerContext = createContext<MessengerType>({
  messenger: undefined,
  messages: [],
  sendMessage: async () => undefined,
  notifications: {},
  clearNotifications: () => undefined,
  loadPrevDay: async () => undefined,
  loadingMessages: false,
  community: undefined,
  contacts: [],
});

export function useMessengerContext() {
  return useContext(MessengerContext);
}

interface NarrowProviderProps {
  children: React.ReactNode;
  activeChannel: string;
  communityKey?: string;
  identity?: Identity;
}

export function MessengerProvider({
  children,
  activeChannel,
  communityKey,
  identity,
}: NarrowProviderProps) {
  const messenger = useMessenger(activeChannel, communityKey, identity);
  return <MessengerContext.Provider value={messenger} children={children} />;
}
