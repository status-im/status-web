import React, { createContext, useContext, useState } from "react";

export enum ChatState {
  ChatCreation,
  ChatBody,
}

type ChatStateContextType = [
  ChatState,
  React.Dispatch<React.SetStateAction<ChatState>>
];

const ChatStateContext = createContext<ChatStateContextType>([
  ChatState.ChatBody,
  () => undefined,
]);

export function useChatState() {
  return useContext(ChatStateContext);
}

export function ChatStateProvider({ children }: { children: React.ReactNode }) {
  const state = useState(ChatState.ChatBody);
  return <ChatStateContext.Provider value={state} children={children} />;
}
