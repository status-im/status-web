import React, { createContext, useContext, useState } from "react";

export enum UserCreationState {
  Creating,
  NotCreating,
}

type UserCreationContextType = [
  UserCreationState,
  React.Dispatch<React.SetStateAction<UserCreationState>>
];

const ChatStateContext = createContext<UserCreationContextType>([
  UserCreationState.NotCreating,
  () => undefined,
]);

export function useUserCreationState() {
  return useContext(ChatStateContext);
}

export function UserCreationStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useState(UserCreationState.NotCreating);
  return <ChatStateContext.Provider value={state} children={children} />;
}
