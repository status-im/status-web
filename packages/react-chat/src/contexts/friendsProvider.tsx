import React, { createContext, useContext, useState } from "react";

const FriendsContext = createContext<{
  friends: string[];
  setFriends: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  friends: [],
  setFriends: () => undefined,
});

export function useFriends() {
  return useContext(FriendsContext);
}

interface FriendsProviderProps {
  children: React.ReactNode;
}

export function FriendsProvider({ children }: FriendsProviderProps) {
  const [friends, setFriends] = useState<string[]>([]);
  return (
    <FriendsContext.Provider
      value={{ friends, setFriends }}
      children={children}
    />
  );
}
