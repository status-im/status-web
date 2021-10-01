import React, { useEffect, useRef } from "react";

import { CommunityData } from "../helpers/communityMock";
import { useRefWidthBreak } from "../hooks/useRefWidthBreak";
import { GlobalStyle } from "../styles/GlobalStyle";
import { Theme } from "../styles/themes";

import { Chat } from "./Chat";

interface ReactChatProps {
  theme: Theme;
  community: CommunityData;
}

export function ReactChat({ theme, community }: ReactChatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const narrow = useRefWidthBreak(ref, 735);
  useEffect(() => {
    console.log(narrow);
  }, [narrow]);
  return (
    <div ref={ref}>
      <GlobalStyle />
      <Chat theme={theme} community={community} />
    </div>
  );
}
