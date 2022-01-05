import React from "react";

import { ChatStateProvider } from "../contexts/chatStateProvider";
import { IdentityProvider } from "../contexts/identityProvider";
import { MessengerProvider } from "../contexts/messengerProvider";
import {
  UserCreationState,
  useUserCreationState,
} from "../contexts/userCreationStateProvider";

import { Chat } from "./Chat";
import { IdentityLoader } from "./Form/IdentityLoader";

export function ChatLoader() {
  const [userCreationState] = useUserCreationState();

  if (userCreationState === UserCreationState.NotCreating)
    return (
      <IdentityProvider>
        <MessengerProvider>
          <ChatStateProvider>
            <Chat />
          </ChatStateProvider>
        </MessengerProvider>
      </IdentityProvider>
    );
  if (userCreationState === UserCreationState.Creating) {
    return <IdentityLoader />;
  }

  return null;
}
