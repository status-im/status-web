import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";

import { ChatStateProvider } from "../contexts/chatStateProvider";
import { IdentityProvider } from "../contexts/identityProvider";
import { MessengerProvider } from "../contexts/messengerProvider";
import {
  UserCreationState,
  useUserCreationState,
} from "../contexts/userCreationStateProvider";

import { Chat } from "./Chat";
import { IdentityLoader } from "./Form/IdentityLoader";

interface ChatLoaderProps {
  communityKey: string;
}

export function ChatLoader({ communityKey }: ChatLoaderProps) {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [userCreationState] = useUserCreationState();

  if (userCreationState === UserCreationState.NotCreating)
    return (
      <IdentityProvider identity={identity}>
        <MessengerProvider identity={identity} communityKey={communityKey}>
          <ChatStateProvider>
            <Chat />
          </ChatStateProvider>
        </MessengerProvider>
      </IdentityProvider>
    );
  if (userCreationState === UserCreationState.Creating) {
    return <IdentityLoader setIdentity={setIdentity} />;
  }

  return null;
}
