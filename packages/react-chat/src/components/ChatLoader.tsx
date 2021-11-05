import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";

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
      <MessengerProvider identity={identity} communityKey={communityKey}>
        <Chat identity={identity} />
      </MessengerProvider>
    );
  } else {
    return <IdentityLoader setIdentity={setIdentity} />;
  }
}
