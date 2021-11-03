import React, { createContext, useContext, useState } from "react";

const BlockedUsersContext = createContext<{
  blockedUsers: string[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  blockedUsers: [],
  setBlockedUsers: () => undefined,
});

export function useBlockedUsers() {
  return useContext(BlockedUsersContext);
}

interface BlockedUsersProviderProps {
  children: React.ReactNode;
}

export function BlockedUsersProvider({ children }: BlockedUsersProviderProps) {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  return (
    <BlockedUsersContext.Provider
      value={{ blockedUsers, setBlockedUsers }}
      children={children}
    />
  );
}
