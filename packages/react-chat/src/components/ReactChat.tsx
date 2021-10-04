import React, { useRef } from "react";

import { NarrowProvider } from "../contexts/narrowProvider";
import { CommunityData } from "../helpers/communityMock";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { Chat } from "./Chat";

interface ReactChatProps {
  theme: Theme;
  community: CommunityData;
}

export function ReactChat({ theme, community }: ReactChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <NarrowProvider myRef={ref}>
      <div ref={ref}>
        <GlobalStyle />
        <Chat theme={theme} community={community} />
      </div>
    </NarrowProvider>
  );
}
