import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";

import { IdentityProvider } from "../contexts/identityProvider";
import { MessengerProvider } from "../contexts/messengerProvider";

import { Chat } from "./Chat";
import { IdentityLoader } from "./Form/IdentityLoader";

interface ChatLoaderProps {
  communityKey: string;
}

export function ChatLoader({ communityKey }: ChatLoaderProps) {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);

  if (identity) {
    return (
      <IdentityProvider identity={identity}>
        <MessengerProvider identity={identity} communityKey={communityKey}>
          <Chat />
        </MessengerProvider>
      </IdentityProvider>
    );
  } else {
    return <IdentityLoader setIdentity={setIdentity} />;
  }
}
