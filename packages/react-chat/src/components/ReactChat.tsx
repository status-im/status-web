import React, { useRef } from "react";

import { NarrowProvider } from "../contexts/narrowProvider";
import { ThemeContextProvider } from "../contexts/themeProvider";
import { CommunityData } from "../helpers/communityMock";
import { Metadata } from "../models/Metadata";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { Chat } from "./Chat";

interface ReactChatProps {
  theme: Theme;
  community: CommunityData;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function ReactChat({ theme, community, fetchMetadata }: ReactChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <ThemeContextProvider theme={theme}>
      <NarrowProvider myRef={ref}>
        <div ref={ref}>
          <GlobalStyle />
          <Chat
            community={community}
            fetchMetadata={fetchMetadata}
            theme={theme}
          />
        </div>
      </NarrowProvider>
    </ThemeContextProvider>
  );
}
