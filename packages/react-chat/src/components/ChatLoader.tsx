import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";

import { Metadata } from "../models/Metadata";
import { Theme } from "../styles/themes";

import { Chat } from "./Chat";
import { IdentityLoader } from "./Form/IdentityLoader";

interface ChatLoaderProps {
  theme: Theme;
  communityKey: string;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function ChatLoader({
  theme,
  communityKey,
  fetchMetadata,
}: ChatLoaderProps) {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);

  if (identity) {
    return (
      <Chat
        communityKey={communityKey}
        fetchMetadata={fetchMetadata}
        theme={theme}
        identity={identity}
      />
    );
  } else {
    return <IdentityLoader setIdentity={setIdentity} />;
  }
}
